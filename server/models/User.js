import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profile: {
      avatar: { type: String, default: '' },
      dateOfBirth: { type: Date },
      gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'], default: 'prefer_not_to_say' },
      height: { type: Number, default: 175 }, // cm
      weight: { type: Number, default: 70 }, // kg
      fitnessLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate',
      },
      fitnessGoal: {
        type: String,
        enum: ['lose_weight', 'build_muscle', 'improve_endurance', 'maintain_fitness', 'increase_strength'],
        default: 'build_muscle',
      },
      targetWeight: { type: Number },
      weeklyWorkoutTarget: { type: Number, default: 4 },
      dailyCalorieTarget: { type: Number, default: 2200 },
      dailyWaterTarget: { type: Number, default: 2500 }, // ml
    },
    preferences: {
      unitSystem: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
      emailNotifications: { type: Boolean, default: true },
      soundEnabled: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
