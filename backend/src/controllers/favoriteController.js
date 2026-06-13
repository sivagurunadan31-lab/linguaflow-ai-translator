import Translation from '../models/Translation.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { demoStore, isDemoMode } from '../utils/demoStore.js';

export const getFavorites = asyncHandler(async (req, res) => {
  if (isDemoMode()) {
    return res.json({ items: demoStore.favorites(req.user._id) });
  }

  const items = await Translation.find({ userId: req.user._id, favorite: true }).sort({ updatedAt: -1 });
  res.json({ items });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  if (isDemoMode()) {
    const item = demoStore.toggleFavorite(req.user._id, req.params.id);
    if (!item) throw new AppError('Translation not found', 404);
    return res.json({ translation: item });
  }

  const item = await Translation.findOne({ _id: req.params.id, userId: req.user._id });

  if (!item) {
    throw new AppError('Translation not found', 404);
  }

  item.favorite = !item.favorite;
  await item.save();

  res.json({ translation: item });
});
