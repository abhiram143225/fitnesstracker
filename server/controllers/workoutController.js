import { Workout } from '../models/Workout.js';
import { UserAchievement, Achievement } from '../models/Achievement.js';

// Helper to check and unlock achievements asynchronously
const evaluateAchievements = async (userId) => {
  try {
    const workouts = await Workout.find({ user: userId }).sort({ date: 1 });
    const totalWorkouts = workouts.length;
    let totalCalories = workouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);

    // Calculate streak
    let currentStreak = 0;
    if (workouts.length > 0) {
      const dates = [...new Set(workouts.map(w => new Date(w.date).toISOString().split('T')[0]))].sort();
      let streak = 1;
      for (let i = dates.length - 1; i > 0; i--) {
        const d1 = new Date(dates[i]);
        const d2 = new Date(dates[i - 1]);
        const diffDays = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
      currentStreak = streak;
    }

    const allAchievements = await Achievement.find();
    for (const ach of allAchievements) {
      let qualified = false;
      let progressVal = 0;

      if (ach.requirement.type === 'total_workouts') {
        progressVal = totalWorkouts;
        qualified = totalWorkouts >= ach.requirement.count;
      } else if (ach.requirement.type === 'streak_days') {
        progressVal = currentStreak;
        qualified = currentStreak >= ach.requirement.count;
      } else if (ach.requirement.type === 'calories_burned') {
        progressVal = totalCalories;
        qualified = totalCalories >= ach.requirement.count;
      }

      if (qualified) {
        await UserAchievement.findOneAndUpdate(
          { user: userId, achievement: ach._id },
          { user: userId, achievement: ach._id, isUnlocked: true, progress: progressVal, unlockedAt: new Date() },
          { upsert: true }
        );
      }
    }
  } catch (err) {
    console.error('[Achievement Check Error]', err.message);
  }
};

// @desc    Get user workouts
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req, res, next) => {
  try {
    const { limit = 20, page = 1, startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Workout.countDocuments(query);
    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('exercises.exercise', 'name category muscleGroups equipment');

    res.status(200).json({
      success: true,
      count: workouts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout by ID
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id }).populate(
      'exercises.exercise'
    );
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req, res, next) => {
  try {
    const { title, date, duration, caloriesBurned, feeling, exercises, notes } = req.body;

    // Estimate calories burned if not provided (average 7 cal/min)
    const estimatedCalories = caloriesBurned || Math.round((duration || 45) * 7.5);

    const workout = await Workout.create({
      user: req.user._id,
      title: title || 'Workout Session',
      date: date || new Date(),
      duration: duration || 45,
      caloriesBurned: estimatedCalories,
      feeling: feeling || 'good',
      exercises: exercises || [],
      notes: notes || '',
    });

    // Asynchronously check achievements in background
    evaluateAchievements(req.user._id);

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully!',
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('exercises.exercise');

    res.status(200).json({
      success: true,
      message: 'Workout updated successfully',
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    res.status(200).json({ success: true, message: 'Workout deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get workouts formatted for calendar month view
// @route   GET /api/workouts/calendar
// @access  Private
export const getCalendarWorkouts = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const y = parseInt(year) || new Date().getFullYear();
    const m = parseInt(month) || new Date().getMonth() + 1; // 1-12

    const startDate = new Date(Date.UTC(y, m - 1, 1));
    const endDate = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

    const workouts = await Workout.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      year: y,
      month: m,
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};
