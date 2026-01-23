import express from 'express';
import { syncLeetCode, getLeetCodeStats } from '../controllers/leetcode.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/sync', syncLeetCode);
router.get('/stats', getLeetCodeStats);

export default router;
