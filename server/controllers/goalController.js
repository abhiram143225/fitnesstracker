import { Goal } from '../models/Goal.js';

// @desc    Get user goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
export const getGoalById = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Create goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res, next) => {
  try {
    const { title, type, targetValue, currentValue, startValue, unit, startDate, targetDate, category, notes } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title,
      type,
      targetValue,
      currentValue: currentValue || startValue || 0,
      startValue: startValue || 0,
      unit: unit || 'kg',
      startDate: startDate || new Date(),
      targetDate: targetDate || null,
      category: category || 'Fitness',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully!',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick update goal progress
// @route   PATCH /api/goals/:id/progress
// @access  Private
export const updateGoalProgress = async (req, res, next) => {
  try {
    const { value, increment } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (increment !== undefined) {
      goal.currentValue += Number(increment);
    } else if (value !== undefined) {
      goal.currentValue = Number(value);
    }

    // Auto-mark completed if target reached (depending on whether it's higher or lower goal)
    if (goal.type === 'weight' && goal.startValue > goal.targetValue) {
      // Weight loss goal
      if (goal.currentValue <= goal.targetValue) {
        goal.status = 'completed';
      }
    } else {
      // General accumulation goal (e.g. reps, workouts, distance)
      if (goal.currentValue >= goal.targetValue) {
        goal.status = 'completed';
      }
    }

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.status(200).json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    next(error);
  }
};
