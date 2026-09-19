import mongoose from 'mongoose';

const setSchema = new mongoose.Schema(
  {
    setNumber: { type: Number, required: true, default: 1 },
    reps: { type: Number, default: 10 },
    weight: { type: Number, default: 0 }, // kg
    duration: { type: Number, default: 0 }, // seconds
    distance: { type: Number, default: 0 }, // km or meters
    completed: { type: Boolean, default: true },
    rpe: { type: Number, min: 1, max: 10, default: 7 }, // Rate of Perceived Exertion
  },
  { _id: false }
);

const workoutExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    exerciseName: { type: String, required: true },
    category: { type: String, default: 'Strength' },
    sets: [setSchema],
    notes: { type: String, default: '' },
  },
  { _id: true }
);

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Workout title is required'],
      trim: true,
      default: 'Daily Workout',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    duration: {
      type: Number,
      default: 45, // minutes
      min: [1, 'Duration must be at least 1 minute'],
    },
    caloriesBurned: {
      type: Number,
      default: 300,
    },
    feeling: {
      type: String,
      enum: ['energized', 'good', 'tired', 'exhausted', 'injured'],
      default: 'good',
    },
    exercises: [workoutExerciseSchema],
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

workoutSchema.index({ user: 1, date: -1 });

export const Workout = mongoose.model('Workout', workoutSchema);
