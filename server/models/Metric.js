import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    type: {
      type: String,
      enum: ['weight', 'body_fat', 'water_intake', 'steps', 'sleep_hours', 'heart_rate_avg', 'calories_consumed'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'kg',
    },
    source: {
      type: String,
      enum: ['manual', 'wearable', 'calculated'],
      default: 'manual',
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

metricSchema.index({ user: 1, type: 1, date: -1 });

export const Metric = mongoose.model('Metric', metricSchema);
