import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const users = [];
const translations = [];

const toPublicUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const createDoc = (data) => {
  const now = new Date().toISOString();
  return { _id: randomUUID(), ...data, createdAt: now, updatedAt: now };
};

export const isDemoMode = () => {
  const uri = process.env.MONGO_URI || '';
  return !uri || uri.includes('<user>') || uri.includes('<password>') || uri.includes('<cluster>');
};

export const demoStore = {
  async createUser({ name, email, password }) {
    const exists = users.find((user) => user.email === email.toLowerCase());
    if (exists) {
      const error = new Error('An account with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    const user = createDoc({
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 12),
      role: users.length === 0 ? 'admin' : 'user',
      avatar: ''
    });
    users.push(user);
    return { ...user, toSafeObject: () => toPublicUser(user) };
  },

  async findUserByEmail(email) {
    const user = users.find((item) => item.email === email.toLowerCase());
    if (!user) return null;
    return {
      ...user,
      comparePassword: (candidate) => bcrypt.compare(candidate, user.password),
      toSafeObject: () => toPublicUser(user)
    };
  },

  async findUserById(id) {
    const user = users.find((item) => item._id === id);
    if (!user) return null;
    return { ...user, toSafeObject: () => toPublicUser(user) };
  },

  async createTranslation(data) {
    const item = createDoc({ ...data, favorite: false });
    translations.unshift(item);
    return item;
  },

  listHistory(userId, { search = '', language = 'all', page = 1, limit = 8 }) {
    const normalizedSearch = search.toLowerCase();
    const filtered = translations.filter((item) => {
      const belongsToUser = item.userId === userId;
      const matchesSearch = !normalizedSearch || item.originalText.toLowerCase().includes(normalizedSearch) || item.translatedText.toLowerCase().includes(normalizedSearch);
      const matchesLanguage = language === 'all' || item.sourceLanguage === language || item.targetLanguage === language || item.detectedLanguage === language;
      return belongsToUser && matchesSearch && matchesLanguage;
    });
    const start = (page - 1) * limit;
    return {
      items: filtered.slice(start, start + limit),
      total: filtered.length
    };
  },

  deleteTranslation(userId, id) {
    const index = translations.findIndex((item) => item.userId === userId && item._id === id);
    if (index === -1) return false;
    translations.splice(index, 1);
    return true;
  },

  clearHistory(userId) {
    for (let index = translations.length - 1; index >= 0; index -= 1) {
      if (translations[index].userId === userId) translations.splice(index, 1);
    }
  },

  toggleFavorite(userId, id) {
    const item = translations.find((translation) => translation.userId === userId && translation._id === id);
    if (!item) return null;
    item.favorite = !item.favorite;
    item.updatedAt = new Date().toISOString();
    return item;
  },

  favorites(userId) {
    return translations.filter((item) => item.userId === userId && item.favorite);
  },

  dashboard(userId) {
    const own = translations.filter((item) => item.userId === userId);
    const languageUsage = Object.entries(own.reduce((acc, item) => {
      acc[item.targetLanguage] = (acc[item.targetLanguage] || 0) + 1;
      return acc;
    }, {})).map(([_id, count]) => ({ _id, count })).slice(0, 5);

    return {
      totalTranslations: own.length,
      favoriteCount: own.filter((item) => item.favorite).length,
      recentTranslations: own.slice(0, 5),
      languageUsage,
      weeklyActivity: []
    };
  },

  adminStats() {
    return {
      userCount: users.length,
      translationCount: translations.length,
      favoriteCount: translations.filter((item) => item.favorite).length,
      recentUsers: users.slice(-6).reverse().map(toPublicUser),
      recentTranslations: translations.slice(0, 8),
      weeklyActivity: []
    };
  },

  users() {
    return users.map(toPublicUser).reverse();
  }
};
