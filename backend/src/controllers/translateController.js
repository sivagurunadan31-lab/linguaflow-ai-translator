import { asyncHandler } from '../utils/asyncHandler.js';
import { createTranslation } from '../services/translationService.js';

export const translateText = asyncHandler(async (req, res) => {
  const { text, sourceLanguage = 'auto', targetLanguage } = req.body;
  const translation = await createTranslation({
    userId: req.user._id,
    text,
    sourceLanguage,
    targetLanguage
  });

  res.status(201).json({ translation });
});
