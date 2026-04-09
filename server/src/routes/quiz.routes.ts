import express from 'express';
import { getQuestions, submitQuiz, getResults } from '../controllers/quiz.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/questions/:subject', getQuestions);
router.post('/submit', submitQuiz);
router.get('/results', getResults);

export default router;
