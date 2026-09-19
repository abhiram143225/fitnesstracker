import express from 'express';
import {
  getSummaryStats,
  getWeeklyAnalytics,
  getCategoryDistribution,
  getAchievements,
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummaryStats);
router.get('/weekly', getWeeklyAnalytics);
router.get('/distribution', getCategoryDistribution);
router.get('/achievements', getAchievements);

export default router;
