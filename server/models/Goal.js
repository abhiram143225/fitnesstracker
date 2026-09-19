import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['weight', 'workouts_per_week', 'distance', 'duration', 'calories', 'strength_pr', 'water', 'custom'],
      required: true,
      default: 'weight',
    },
    targetValue: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    startValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: 'kg',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'paused', 'failed'],
      default: 'in_progress',
      index: true,
    },
    category: {
      type: String,
      default: 'Fitness',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.index({ user: 1, status: 1 });

export const Goal = mongoose.model('Goal', goalSchema);
