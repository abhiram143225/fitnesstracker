import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['workouts', 'streak', 'strength', 'cardio', 'consistency', 'milestone'], default: 'workouts' },
    icon: { type: String, default: 'Trophy' },
    points: { type: Number, default: 50 },
    requirement: {
      type: { type: String, required: true }, // e.g., 'total_workouts', 'streak_days', 'calories_burned'
      count: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const userAchievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    achievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement', required: true },
    unlockedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    isUnlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

export const Achievement = mongoose.model('Achievement', achievementSchema);
export const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
