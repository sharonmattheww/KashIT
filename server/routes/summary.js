import { Router } from 'express';
import { getMonthlySummary } from '../controllers/summaryController.js';
import { getMonthlyTrend } from '../controllers/trendController.js';
import { getDailySummary } from '../controllers/dailyController.js';

const router = Router();

router.get('/', getMonthlySummary);
router.get('/trend', getMonthlyTrend);
router.get('/daily', getDailySummary);

export default router;
