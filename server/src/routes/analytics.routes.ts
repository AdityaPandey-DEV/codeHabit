import express from 'express';
import { getDashboardAnalytics } from '../controllers/analytics.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardAnalytics);

export default router;
