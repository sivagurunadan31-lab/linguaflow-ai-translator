import express from 'express';
import { getAdminStats, getAdminUsers } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);

export default router;
