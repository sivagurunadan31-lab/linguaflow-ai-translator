import Translation from '../models/Translation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { demoStore, isDemoMode } from '../utils/demoStore.js';

export const getDashboard = asyncHandler(async (req, res) => {
  if (isDemoMode()) {
    return res.json(demoStore.dashboard(req.user._id));
  }

  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const [totalTranslations, favoriteCount, recentTranslations, languageUsage, weeklyActivity] = await Promise.all([
    Translation.countDocuments({ userId: req.user._id }),
    Translation.countDocuments({ userId: req.user._id, favorite: true }),
    Translation.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5),
    Translation.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$targetLanguage', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]),
    Translation.aggregate([
      { $match: { userId: req.user._id, createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({ totalTranslations, favoriteCount, recentTranslations, languageUsage, weeklyActivity });
});
