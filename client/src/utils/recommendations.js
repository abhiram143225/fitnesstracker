// Helper to compute BMI, BMI Category, and Personalized Exercise Recommendations

export const calculateBmi = (heightCm, weightKg) => {
  const heightM = Number(heightCm) / 100;
  if (!heightM || heightM <= 0 || !weightKg || weightKg <= 0) {
    return { bmi: 22.0, category: 'Normal weight', color: '#10b981' };
  }
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) {
    return { bmi, category: 'Underweight', color: '#38bdf8' };
  } else if (bmi < 25) {
    return { bmi, category: 'Normal weight', color: '#10b981' };
  } else if (bmi < 30) {
    return { bmi, category: 'Overweight', color: '#f59e0b' };
  } else {
    return { bmi, category: 'Obese', color: '#ef4444' };
  }
};

export const getPersonalizedPlan = (profile = {}) => {
  const height = profile.height || 175;
  const weight = profile.weight || 70;
  const goal = profile.fitnessGoal || 'build_muscle';
  const level = profile.fitnessLevel || 'intermediate';

  const { bmi, category, color } = calculateBmi(height, weight);

  let recommendation = {
    bmi,
    bmiCategory: category,
    bmiColor: color,
    title: 'Customized Routine',
    strategy: '',
    recommendedCategories: ['Strength'],
    recommendedExercises: [],
    targetReps: '8 - 12 reps',
    targetSets: '3 - 4 sets',
    restInterval: '60 - 90 seconds',
    cardioAdvice: '',
  };

  switch (goal) {
    case 'build_muscle':
      recommendation.title = 'Hypertrophy & Muscle Growth Protocol';
      recommendation.strategy =
        bmi < 18.5
          ? 'Focus on compound resistance movements and a caloric surplus to build dense muscle mass.'
          : 'Focus on progressive overload with moderate-to-heavy resistance and optimal protein synthesis.';
      recommendation.recommendedCategories = ['Strength', 'Calisthenics'];
      recommendation.recommendedExercises = [
        'Barbell Bench Press',
        'Barbell Back Squat',
        'Incline Dumbbell Press',
        'Lat Pulldown',
        'Romanian Deadlift',
        'Barbell Bicep Curl',
      ];
      recommendation.targetReps = '8 - 12 reps';
      recommendation.targetSets = '3 - 4 sets';
      recommendation.restInterval = '75 - 90 seconds';
      recommendation.cardioAdvice = 'Low intensity steady state (LISS) 1-2 times weekly to preserve muscle.';
      break;

    case 'lose_weight':
      recommendation.title = 'Metabolic Fat Burn & Lean Conditioning';
      recommendation.strategy =
        bmi >= 25
          ? 'Combine full-body compound circuits with high-energy HIIT to accelerate caloric burn while safeguarding joints.'
          : 'Maintain high energy output with balanced resistance training and cardiovascular intervals.';
      recommendation.recommendedCategories = ['HIIT', 'Cardio', 'Strength', 'Core'];
      recommendation.recommendedExercises = [
        'HIIT Kettlebell Swings',
        'Burpees',
        'Treadmill Running',
        'Push-Ups',
        'Stationary Cycling',
        'Plank',
      ];
      recommendation.targetReps = '12 - 15 reps';
      recommendation.targetSets = '3 - 4 sets';
      recommendation.restInterval = '45 - 60 seconds';
      recommendation.cardioAdvice = 'Moderate-to-high intensity cardio 3-4 times per week.';
      break;

    case 'increase_strength':
      recommendation.title = 'Maximal Pure Strength & Power';
      recommendation.strategy =
        'Focus heavily on compound power lifts, lower repetition ranges with heavy loads, and extended rest intervals.';
      recommendation.recommendedCategories = ['Strength'];
      recommendation.recommendedExercises = [
        'Conventional Deadlift',
        'Barbell Back Squat',
        'Barbell Bench Press',
        'Overhead Shoulder Press (OHP)',
        'Pull-Ups / Chin-Ups',
      ];
      recommendation.targetReps = '3 - 6 reps';
      recommendation.targetSets = '4 - 5 sets';
      recommendation.restInterval = '2 - 3 minutes';
      recommendation.cardioAdvice = 'Light recovery cardio only to aid blood circulation.';
      break;

    case 'improve_endurance':
      recommendation.title = 'Cardiovascular Stamina & Athletic Endurance';
      recommendation.strategy =
        'Prioritize sustained aerobic output, muscular stamina, and core stabilization.';
      recommendation.recommendedCategories = ['Cardio', 'Calisthenics', 'Core'];
      recommendation.recommendedExercises = [
        'Treadmill Running',
        'Stationary Cycling',
        'Burpees',
        'Push-Ups',
        'Plank',
        'Hanging Leg Raise',
      ];
      recommendation.targetReps = '15 - 20 reps';
      recommendation.targetSets = '3 sets';
      recommendation.restInterval = '30 - 45 seconds';
      recommendation.cardioAdvice = 'Long duration endurance training 3-5 times weekly.';
      break;

    case 'maintain_fitness':
    default:
      recommendation.title = 'Full-Body Functional Conditioning';
      recommendation.strategy =
        'Maintain balanced full-body strength, mobility, and cardiovascular health.';
      recommendation.recommendedCategories = ['Strength', 'Cardio', 'Core'];
      recommendation.recommendedExercises = [
        'Push-Ups',
        'Lat Pulldown',
        'Leg Press',
        'Seated Cable Row',
        'Plank',
        'Stationary Cycling',
      ];
      recommendation.targetReps = '10 - 12 reps';
      recommendation.targetSets = '3 sets';
      recommendation.restInterval = '60 seconds';
      recommendation.cardioAdvice = '20-30 minutes of aerobic cardio 2-3 times per week.';
      break;
  }

  return recommendation;
};
