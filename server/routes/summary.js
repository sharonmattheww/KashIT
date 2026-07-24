import { Router } from 'express';
import { getMonthlySummary } from '../controllers/summaryController.js';
import { getMonthlyTrend } from '../controllers/trendController.js';
import { getDailyBreakdown } from '../controllers/dailyController.js';

const router = Router();

router.get('/', getMonthlySummary);
router.get('/trend', getMonthlyTrend);
router.get('/daily', getDailyBreakdown);

export default router;
