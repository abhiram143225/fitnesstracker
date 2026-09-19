import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Exercise } from '../models/Exercise.js';
import { Achievement } from '../models/Achievement.js';
import { connectDB } from '../config/db.js';

dotenv.config();

export const initialExercises = [
  {
    name: 'Barbell Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest'],
    secondaryMuscles: ['Triceps', 'Front Shoulders'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    caloriesPerMinute: 7.5,
    instructions: [
      'Lie flat on the bench with your eyes under the bar.',
      'Grip the bar slightly wider than shoulder-width with wrists straight.',
      'Unrack the bar, retract your shoulder blades, and brace your core.',
      'Lower the bar with control to your mid-chest.',
      'Press the bar explosively back to the starting position without locking elbows aggressively.'
    ],
    tips: ['Keep your feet planted firmly on the floor.', 'Do not bounce the bar off your chest.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'Strength',
    muscleGroups: ['Chest'],
    secondaryMuscles: ['Front Shoulders', 'Triceps'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    caloriesPerMinute: 7.0,
    instructions: [
      'Set an incline bench to roughly 30-45 degrees.',
      'Sit with dumbbells resting on your thighs, then kick them up to shoulder height.',
      'Press the dumbbells straight up while keeping your chest high.',
      'Lower under control until your elbows reach approximately 90 degrees.',
      'Press up and slightly inward at the top.'
    ],
    tips: ['Avoid overarching your lower back.', 'Control the eccentric phase.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Push-Ups',
    category: 'Calisthenics',
    muscleGroups: ['Chest'],
    secondaryMuscles: ['Triceps', 'Core', 'Front Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    caloriesPerMinute: 8.0,
    instructions: [
      'Place hands shoulder-width apart on the floor with fingers pointing forward.',
      'Form a straight line from your head to your heels.',
      'Lower your chest until it is an inch off the floor.',
      'Push through your palms to return to starting plank position.'
    ],
    tips: ['Engage glutes and core throughout the movement.'],
    media: { icon: 'Flame' },
  },
  {
    name: 'Barbell Back Squat',
    category: 'Strength',
    muscleGroups: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Lower Back', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    caloriesPerMinute: 9.0,
    instructions: [
      'Rest the barbell across your upper traps or rear delts.',
      'Position feet shoulder-width apart, toes slightly turned out.',
      'Hinge at hips and bend knees simultaneously, keeping chest upright.',
      'Descend until thighs are parallel to or below the floor.',
      'Drive through your heels to return to standing.'
    ],
    tips: ['Keep knees tracking over your toes.', 'Maintain a neutral spine.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Romanian Deadlift',
    category: 'Strength',
    muscleGroups: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Lower Back', 'Forearms', 'Traps'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    caloriesPerMinute: 8.5,
    instructions: [
      'Hold barbell at hip height with an overhand grip.',
      'Keep a soft bend in knees and push hips backward.',
      'Lower the bar along your shins until you feel a deep hamstring stretch.',
      'Contract glutes and drive hips forward to return to standing.'
    ],
    tips: ['Do not round your lower back.', 'Movement is a hip hinge, not a squat.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Leg Press',
    category: 'Strength',
    muscleGroups: ['Quads'],
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    caloriesPerMinute: 6.5,
    instructions: [
      'Sit in machine with feet shoulder-width in the center of the platform.',
      'Release safety handles and lower the platform until knees are at 90 degrees.',
      'Push the platform away through mid-foot and heels.',
      'Avoid fully locking out your knees at the top.'
    ],
    tips: ['Keep your lower back glued to the backrest.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Conventional Deadlift',
    category: 'Strength',
    muscleGroups: ['Back', 'Glutes', 'Hamstrings'],
    secondaryMuscles: ['Traps', 'Forearms', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    caloriesPerMinute: 10.0,
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot.',
      'Bend over and grip bar just outside knees.',
      'Drop hips, pull shoulder blades back, take a deep breath and brace core.',
      'Drive through the floor, extending hips and knees together until standing tall.'
    ],
    tips: ['Keep bar path as close to your body as possible.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Pull-Ups / Chin-Ups',
    category: 'Calisthenics',
    muscleGroups: ['Back', 'Lats'],
    secondaryMuscles: ['Biceps', 'Forearms', 'Rear Delts'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    caloriesPerMinute: 8.5,
    instructions: [
      'Grip the pull-up bar with hands just outside shoulder-width.',
      'Hang with arms fully extended.',
      'Pull elbows down toward your ribs to bring your chin above the bar.',
      'Lower with control back to a dead hang.'
    ],
    tips: ['Initiate the movement by depressing your shoulder blades.'],
    media: { icon: 'Activity' },
  },
  {
    name: 'Lat Pulldown',
    category: 'Strength',
    muscleGroups: ['Back', 'Lats'],
    secondaryMuscles: ['Biceps', 'Middle Back'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    caloriesPerMinute: 6.5,
    instructions: [
      'Sit comfortably with thigh pads adjusted snugly.',
      'Grip the wide bar with palms facing forward.',
      'Lean back slightly and pull bar down to upper chest.',
      'Squeeze shoulder blades, then slowly return to the top.'
    ],
    tips: ['Do not use excessive momentum to jerk the weight down.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Seated Cable Row',
    category: 'Strength',
    muscleGroups: ['Back'],
    secondaryMuscles: ['Biceps', 'Rear Shoulders', 'Lats'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    caloriesPerMinute: 7.0,
    instructions: [
      'Sit on bench with feet against foot plates and knees slightly bent.',
      'Grip V-bar handle and sit tall with neutral spine.',
      'Pull handle towards your abdomen while squeezing shoulder blades.',
      'Extend arms slowly back to starting position.'
    ],
    tips: ['Avoid excessive forward and backward torso swinging.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Overhead Shoulder Press (OHP)',
    category: 'Strength',
    muscleGroups: ['Shoulders'],
    secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    caloriesPerMinute: 8.0,
    instructions: [
      'Hold bar at clavicle level with elbows under wrists.',
      'Brace core and glutes firmly.',
      'Press bar vertically overhead, moving head back slightly to clear the bar.',
      'Lock out overhead with arms aligned with ears.'
    ],
    tips: ['Do not arch your lower back aggressively.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Dumbbell Lateral Raise',
    category: 'Strength',
    muscleGroups: ['Shoulders'],
    secondaryMuscles: ['Traps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    caloriesPerMinute: 6.0,
    instructions: [
      'Stand holding dumbbells at your sides with slight elbow bend.',
      'Raise dumbbells out to the sides until parallel with shoulders.',
      'Pause briefly at the top with pinkies slightly higher than thumbs.',
      'Lower dumbbells slowly back down.'
    ],
    tips: ['Lead with elbows, not wrists.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Barbell Bicep Curl',
    category: 'Strength',
    muscleGroups: ['Arms', 'Biceps'],
    secondaryMuscles: ['Forearms'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    caloriesPerMinute: 6.0,
    instructions: [
      'Hold barbell with underhand shoulder-width grip.',
      'Keep elbows pinned near ribs.',
      'Curl the bar upwards by contracting biceps.',
      'Lower bar slowly under control to full extension.'
    ],
    tips: ['Do not swing your hips to generate momentum.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Tricep Rope Pushdown',
    category: 'Strength',
    muscleGroups: ['Arms', 'Triceps'],
    secondaryMuscles: ['Forearms'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    caloriesPerMinute: 5.5,
    instructions: [
      'Attach rope to high pulley and grip both ends.',
      'Keep elbows fixed at your sides.',
      'Push rope downward, spreading the rope ends apart at the bottom.',
      'Return to 90 degree elbow bend.'
    ],
    tips: ['Lock your upper arms in place throughout the rep.'],
    media: { icon: 'Dumbbell' },
  },
  {
    name: 'Plank',
    category: 'Core',
    muscleGroups: ['Core', 'Abs'],
    secondaryMuscles: ['Shoulders', 'Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    caloriesPerMinute: 5.0,
    instructions: [
      'Rest on forearms and toes with elbows directly below shoulders.',
      'Keep hips level with spine and shoulders.',
      'Squeeze abs, glutes, and quadriceps tightly.',
      'Hold position while breathing rhythmically.'
    ],
    tips: ['Do not let your hips sag down or pike into the air.'],
    media: { icon: 'Shield' },
  },
  {
    name: 'Hanging Leg Raise',
    category: 'Core',
    muscleGroups: ['Core', 'Abs'],
    secondaryMuscles: ['Hip Flexors', 'Forearms'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    caloriesPerMinute: 7.0,
    instructions: [
      'Hang from a pull-up bar with straight arms.',
      'Keep legs straight or slightly bent.',
      'Raise legs up toward 90 degrees by contracting lower abdominals.',
      'Lower slowly without swinging back and forth.'
    ],
    tips: ['Control momentum between repetitions.'],
    media: { icon: 'Activity' },
  },
  {
    name: 'Treadmill Running',
    category: 'Cardio',
    muscleGroups: ['Cardio', 'Quads', 'Calves'],
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Core'],
    equipment: 'Cardio Machine',
    difficulty: 'Intermediate',
    caloriesPerMinute: 11.5,
    instructions: [
      'Step onto treadmill, clip safety key to clothing.',
      'Start at a warm-up walking speed for 3 minutes.',
      'Increase speed to targeted running pace (e.g., 8-12 km/h).',
      'Maintain an upright posture and relaxed arm swings.'
    ],
    tips: ['Land softly on mid-foot.'],
    media: { icon: 'Flame' },
  },
  {
    name: 'Stationary Cycling',
    category: 'Cardio',
    muscleGroups: ['Cardio', 'Quads'],
    secondaryMuscles: ['Calves', 'Hamstrings', 'Glutes'],
    equipment: 'Cardio Machine',
    difficulty: 'Beginner',
    caloriesPerMinute: 9.0,
    instructions: [
      'Adjust seat height so knee has a slight bend at bottom of pedal stroke.',
      'Pedal at a steady cadence (70-90 RPM).',
      'Adjust resistance to simulate flats or uphill climbs.'
    ],
    tips: ['Avoid resting excessive upper body weight on handlebars.'],
    media: { icon: 'Activity' },
  },
  {
    name: 'HIIT Kettlebell Swings',
    category: 'HIIT',
    muscleGroups: ['Glutes', 'Hamstrings', 'Core'],
    secondaryMuscles: ['Shoulders', 'Lats', 'Grip'],
    equipment: 'Kettlebell',
    difficulty: 'Intermediate',
    caloriesPerMinute: 13.0,
    instructions: [
      'Stand with feet shoulder-width, kettlebell one foot in front of you.',
      'Hinge hips back, grab kettlebell handle with both hands.',
      'Hike kettlebell between legs, then snap hips forward vigorously.',
      'Let kettlebell float to chest level before hinging back for next rep.'
    ],
    tips: ['Power comes from snappy hip extension, not arm lifting.'],
    media: { icon: 'Zap' },
  },
  {
    name: 'Burpees',
    category: 'HIIT',
    muscleGroups: ['Cardio', 'Chest', 'Quads'],
    secondaryMuscles: ['Shoulders', 'Abs', 'Calves'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    caloriesPerMinute: 12.0,
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Drop into a squat, place hands on floor, kick feet back to plank.',
      'Perform a push-up, jump feet back up to hands.',
      'Explosively jump vertically into the air with hands overhead.'
    ],
    tips: ['Maintain rhythm and steady breathing.'],
    media: { icon: 'Flame' },
  }
];

export const initialAchievements = [
  {
    code: 'first_workout',
    title: 'First Step to Greatness',
    description: 'Logged your very first workout in the app.',
    category: 'milestone',
    icon: 'Award',
    points: 50,
    requirement: { type: 'total_workouts', count: 1 },
  },
  {
    code: 'streak_3',
    title: 'Consistency Starter',
    description: 'Maintained a 3-day workout streak.',
    category: 'streak',
    icon: 'Flame',
    points: 100,
    requirement: { type: 'streak_days', count: 3 },
  },
  {
    code: 'streak_7',
    title: 'Unstoppable Momentum',
    description: 'Maintained a 7-day workout streak.',
    category: 'streak',
    icon: 'Zap',
    points: 250,
    requirement: { type: 'streak_days', count: 7 },
  },
  {
    code: 'workouts_10',
    title: 'Iron Dedication',
    description: 'Completed 10 workouts total.',
    category: 'workouts',
    icon: 'Dumbbell',
    points: 200,
    requirement: { type: 'total_workouts', count: 10 },
  },
  {
    code: 'workouts_25',
    title: 'Gym Veteran',
    description: 'Completed 25 workouts total.',
    category: 'workouts',
    icon: 'Trophy',
    points: 500,
    requirement: { type: 'total_workouts', count: 25 },
  },
  {
    code: 'calories_5000',
    title: 'Calorie Furnace',
    description: 'Burned a cumulative 5,000 calories.',
    category: 'cardio',
    icon: 'Flame',
    points: 300,
    requirement: { type: 'calories_burned', count: 5000 },
  },
  {
    code: 'goal_achieved',
    title: 'Goal Crusher',
    description: 'Successfully reached and completed a fitness goal.',
    category: 'consistency',
    icon: 'Target',
    points: 200,
    requirement: { type: 'goals_completed', count: 1 },
  }
];

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Seeding default exercises and achievements...');

    for (const item of initialExercises) {
      await Exercise.findOneAndUpdate(
        { name: item.name },
        { ...item },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${initialExercises.length} exercises.`);

    for (const ach of initialAchievements) {
      await Achievement.findOneAndUpdate(
        { code: ach.code },
        { ...ach },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${initialAchievements.length} achievements.`);

    console.log('[Seed] Database seeding completed successfully.');
    if (process.argv[1]?.includes('seedData.js')) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
    if (process.argv[1]?.includes('seedData.js')) {
      process.exit(1);
    }
  }
};

if (process.argv[1]?.includes('seedData.js')) {
  seedDatabase();
}
