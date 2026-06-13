import express from 'express';
import { translateText } from '../controllers/translateController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateTranslation } from '../middleware/validate.js';

const router = express.Router();

router.post('/', protect, validateTranslation, translateText);

export default router;
