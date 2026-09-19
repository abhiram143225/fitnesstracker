import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Core', 'Calisthenics', 'Recovery'],
      default: 'Strength',
    },
    muscleGroups: {
      type: [String],
      required: true,
      validate: [v => Array.isArray(v) && v.length > 0, 'At least one muscle group is required'],
    },
    secondaryMuscles: {
      type: [String],
      default: [],
    },
    equipment: {
      type: String,
      enum: ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'Bands', 'Cardio Machine', 'None', 'Other'],
      default: 'Barbell',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    instructions: {
      type: [String],
      default: [],
    },
    tips: {
      type: [String],
      default: [],
    },
    caloriesPerMinute: {
      type: Number,
      default: 7,
    },
    media: {
      image: { type: String, default: '' },
      icon: { type: String, default: 'Dumbbell' },
      videoUrl: { type: String, default: '' },
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

exerciseSchema.index({ category: 1, muscleGroups: 1, difficulty: 1 });
exerciseSchema.index({ name: 'text' });

export const Exercise = mongoose.model('Exercise', exerciseSchema);
