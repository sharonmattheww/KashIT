import { Router } from 'express';
import { getMonthlySummary } from '../controllers/summaryController.js';
import { getMonthlyTrend } from '../controllers/trendController.js';

const router = Router();

router.get('/', getMonthlySummary);
router.get('/trend', getMonthlyTrend);

export default router;
