import express from 'express';
import { body } from 'express-validator';
import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getCalendarWorkouts,
} from '../controllers/workoutController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

// All workout routes require authentication
router.use(protect);

router.get('/calendar', getCalendarWorkouts);

router.route('/')
  .get(getWorkouts)
  .post(
    [
      body('title').notEmpty().withMessage('Workout title is required'),
      body('duration').isNumeric().withMessage('Duration must be a number'),
      validateRequest,
    ],
    createWorkout
  );

router.route('/:id')
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

export default router;
