import Translation from '../models/Translation.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { demoStore, isDemoMode } from '../utils/demoStore.js';

const buildHistoryQuery = (userId, query) => {
  const filter = { userId };

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.language && query.language !== 'all') {
    filter.$or = [
      { sourceLanguage: query.language },
      { targetLanguage: query.language },
      { detectedLanguage: query.language }
    ];
  }

  return filter;
};

export const getHistory = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);

  if (isDemoMode()) {
    const { items, total } = demoStore.listHistory(req.user._id, {
      search: req.query.search,
      language: req.query.language || 'all',
      page,
      limit
    });
    return res.json({ items, page, limit, total, pages: Math.ceil(total / limit) || 1 });
  }

  const skip = (page - 1) * limit;
  const filter = buildHistoryQuery(req.user._id, req.query);

  const [items, total] = await Promise.all([
    Translation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Translation.countDocuments(filter)
  ]);

  res.json({
    items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1
  });
});

export const deleteHistoryItem = asyncHandler(async (req, res) => {
  if (isDemoMode()) {
    if (!demoStore.deleteTranslation(req.user._id, req.params.id)) {
      throw new AppError('Translation not found', 404);
    }
    return res.json({ message: 'Translation deleted' });
  }

  const item = await Translation.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!item) {
    throw new AppError('Translation not found', 404);
  }

  res.json({ message: 'Translation deleted' });
});

export const clearHistory = asyncHandler(async (req, res) => {
  if (isDemoMode()) {
    demoStore.clearHistory(req.user._id);
    return res.json({ message: 'History cleared' });
  }

  await Translation.deleteMany({ userId: req.user._id });
  res.json({ message: 'History cleared' });
});
