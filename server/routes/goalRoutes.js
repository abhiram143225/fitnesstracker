import express from 'express';
import { body } from 'express-validator';
import {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(
    [
      body('title').notEmpty().withMessage('Goal title is required'),
      body('type').notEmpty().withMessage('Goal type is required'),
      body('targetValue').isNumeric().withMessage('Target value must be a number'),
      validateRequest,
    ],
    createGoal
  );

router.route('/:id')
  .get(getGoalById)
  .put(updateGoal)
  .delete(deleteGoal);

router.patch('/:id/progress', updateGoalProgress);

export default router;
