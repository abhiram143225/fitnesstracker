import { Workout } from '../models/Workout.js';
import { Goal } from '../models/Goal.js';
import { UserAchievement, Achievement } from '../models/Achievement.js';
import { initialAchievements } from '../utils/seedData.js';

// @desc    Get dashboard summary statistics
// @route   GET /api/progress/summary
// @access  Private
export const getSummaryStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all workouts
    const workouts = await Workout.find({ user: userId }).sort({ date: 1 });

    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;

    if (workouts.length > 0) {
      const dates = [...new Set(workouts.map(w => new Date(w.date).toISOString().split('T')[0]))].sort();
      let streak = 1;
      let maxStreak = 1;

      for (let i = 1; i < dates.length; i++) {
        const d1 = new Date(dates[i]);
        const d2 = new Date(dates[i - 1]);
        const diffDays = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          streak++;
          if (streak > maxStreak) maxStreak = streak;
        } else if (diffDays > 1) {
          streak = 1;
        }
      }

      // Check if last workout was today or yesterday to consider streak active
      const lastWorkoutDate = new Date(dates[dates.length - 1]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffFromToday = Math.round((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));

      currentStreak = diffFromToday <= 1 ? streak : 0;
      longestStreak = maxStreak;
    }

    // Active Goals
    const activeGoals = await Goal.find({ user: userId, status: 'in_progress' }).limit(3);
    const completedGoalsCount = await Goal.countDocuments({ user: userId, status: 'completed' });

    // Recent Workouts
    const recentWorkouts = await Workout.find({ user: userId })
      .sort({ date: -1 })
      .limit(5)
      .populate('exercises.exercise', 'name category');

    // This week workouts
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const workoutsThisWeek = workouts.filter(w => new Date(w.date) >= startOfWeek).length;

    res.status(200).json({
      success: true,
      data: {
        totalWorkouts,
        totalMinutes,
        totalCalories,
        currentStreak,
        longestStreak,
        workoutsThisWeek,
        weeklyGoal: req.user.profile?.weeklyWorkoutTarget || 4,
        completedGoalsCount,
        activeGoals,
        recentWorkouts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly chart analytics (day by day)
// @route   GET /api/progress/weekly
// @access  Private
export const getWeeklyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Generate past 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);

      const dayWorkouts = await Workout.find({
        user: userId,
        date: { $gte: d, $lt: nextDay },
      });

      const calories = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      const minutes = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      const workoutCount = dayWorkouts.length;

      result.push({
        date: d.toISOString().split('T')[0],
        day: days[d.getDay()],
        calories,
        minutes,
        workouts: workoutCount,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get muscle group and category distribution
// @route   GET /api/progress/distribution
// @access  Private
export const getCategoryDistribution = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const workouts = await Workout.find({ user: userId }).populate('exercises.exercise');

    const categoryMap = {};
    const muscleMap = {};

    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        const cat = ex.category || ex.exercise?.category || 'Strength';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;

        if (ex.exercise?.muscleGroups) {
          ex.exercise.muscleGroups.forEach(m => {
            muscleMap[m] = (muscleMap[m] || 0) + 1;
          });
        }
      });
    });

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    const muscleData = Object.entries(muscleMap).map(([name, value]) => ({ name, value }));

    res.status(200).json({
      success: true,
      categories: categoryData.length ? categoryData : [{ name: 'Strength', value: 1 }],
      muscles: muscleData.length ? muscleData : [{ name: 'Full Body', value: 1 }],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user achievements list with unlock status
// @route   GET /api/progress/achievements
// @access  Private
export const getAchievements = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Ensure achievements exist
    let allAchievements = await Achievement.find().sort({ points: 1 });
    if (allAchievements.length === 0) {
      await Achievement.insertMany(initialAchievements);
      allAchievements = await Achievement.find().sort({ points: 1 });
    }

    const userUnlocked = await UserAchievement.find({ user: userId }).populate('achievement');
    const unlockedMap = {};
    userUnlocked.forEach(ua => {
      if (ua.achievement) {
        unlockedMap[ua.achievement._id.toString()] = ua;
      }
    });

    const enriched = allAchievements.map(ach => {
      const userStatus = unlockedMap[ach._id.toString()];
      return {
        _id: ach._id,
        code: ach.code,
        title: ach.title,
        description: ach.description,
        category: ach.category,
        icon: ach.icon,
        points: ach.points,
        requirement: ach.requirement,
        isUnlocked: Boolean(userStatus?.isUnlocked),
        unlockedAt: userStatus?.unlockedAt || null,
        progress: userStatus?.progress || 0,
      };
    });

    const totalPoints = enriched.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.points, 0);

    res.status(200).json({
      success: true,
      totalPoints,
      unlockedCount: enriched.filter(a => a.isUnlocked).length,
      totalCount: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};
