import express from 'express';
import { clearHistory, deleteHistoryItem, getHistory } from '../controllers/historyController.js';
import { getDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getHistory);
router.get('/dashboard', getDashboard);
router.delete('/:id', deleteHistoryItem);
router.delete('/', clearHistory);

export default router;
