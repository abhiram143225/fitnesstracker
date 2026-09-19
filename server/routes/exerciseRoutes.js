import express from 'express';
import { body } from 'express-validator';
import {
  getExercises,
  getExerciseById,
  createExercise,
  deleteExercise,
} from '../controllers/exerciseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getExercises)
  .post(
    protect,
    [
      body('name').notEmpty().withMessage('Exercise name is required'),
      body('category').notEmpty().withMessage('Category is required'),
      body('muscleGroups').isArray({ min: 1 }).withMessage('At least one muscle group is required'),
      validateRequest,
    ],
    createExercise
  );

router.route('/:id')
  .get(getExerciseById)
  .delete(protect, deleteExercise);

export default router;
