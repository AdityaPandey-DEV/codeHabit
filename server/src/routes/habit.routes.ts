import express from 'express';
import { createHabit, getAllHabits, logHabit, getHabitLogs } from '../controllers/habit.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect); // Protect all habit routes

router.route('/')
    .get(getAllHabits)
    .post(createHabit);

router.post('/:id/log', logHabit);
router.get('/logs', getHabitLogs);

export default router;
