import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, async (req, res) => {
    const user = { ...req.user };
    delete user.password;
    res.json({ status: 'success', data: { user } });
});

export default router;

