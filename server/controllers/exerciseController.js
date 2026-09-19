import { Exercise } from '../models/Exercise.js';
import { initialExercises } from '../utils/seedData.js';

// @desc    Get all exercises with search, category, muscle, equipment, difficulty filters
// @route   GET /api/exercises
// @access  Public
export const getExercises = async (req, res, next) => {
  try {
    const { category, muscle, equipment, difficulty, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (muscle && muscle !== 'All') {
      query.muscleGroups = { $in: [muscle] };
    }
    if (equipment && equipment !== 'All') {
      query.equipment = equipment;
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let exercises = await Exercise.find(query).sort({ name: 1 });

    // Auto-seed if database is empty so frontend never starts blank
    if (exercises.length === 0 && !search && (!category || category === 'All') && (!muscle || muscle === 'All')) {
      const count = await Exercise.countDocuments();
      if (count === 0) {
        await Exercise.insertMany(initialExercises);
        exercises = await Exercise.find(query).sort({ name: 1 });
      }
    }

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exercise by ID
// @route   GET /api/exercises/:id
// @access  Public
export const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }
    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    next(error);
  }
};

// @desc    Create custom exercise
// @route   POST /api/exercises
// @access  Private
export const createExercise = async (req, res, next) => {
  try {
    const { name, category, muscleGroups, secondaryMuscles, equipment, difficulty, instructions, tips, caloriesPerMinute } = req.body;

    const existing = await Exercise.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An exercise with this name already exists' });
    }

    const exercise = await Exercise.create({
      name,
      category,
      muscleGroups,
      secondaryMuscles: secondaryMuscles || [],
      equipment,
      difficulty,
      instructions: instructions || [],
      tips: tips || [],
      caloriesPerMinute: caloriesPerMinute || 7,
      isCustom: true,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Exercise created successfully', data: exercise });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom exercise
// @route   DELETE /api/exercises/:id
// @access  Private
export const deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    if (exercise.isCustom && exercise.createdBy && exercise.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this exercise' });
    }

    await Exercise.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Exercise deleted successfully' });
  } catch (error) {
    next(error);
  }
};
