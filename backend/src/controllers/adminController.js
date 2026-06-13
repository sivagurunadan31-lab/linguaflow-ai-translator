import Translation from '../models/Translation.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { demoStore, isDemoMode } from '../utils/demoStore.js';

export const getAdminStats = asyncHandler(async (_req, res) => {
  if (isDemoMode()) {
    return res.json(demoStore.adminStats());
  }

  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const [userCount, translationCount, favoriteCount, recentUsers, recentTranslations, weeklyActivity] = await Promise.all([
    User.countDocuments(),
    Translation.countDocuments(),
    Translation.countDocuments({ favorite: true }),
    User.find().sort({ createdAt: -1 }).limit(6).select('-password'),
    Translation.find().sort({ createdAt: -1 }).limit(8).populate('userId', 'name email'),
    Translation.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({ userCount, translationCount, favoriteCount, recentUsers, recentTranslations, weeklyActivity });
});

export const getAdminUsers = asyncHandler(async (_req, res) => {
  if (isDemoMode()) {
    return res.json({ users: demoStore.users() });
  }

  const users = await User.find().sort({ createdAt: -1 }).select('-password');
  res.json({ users });
});
