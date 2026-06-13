import validator from 'validator';
import { languageCodes } from '../config/languages.js';
import { AppError } from '../utils/AppError.js';

export const validateRegister = (req, _res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) throw new AppError('Name must be at least 2 characters', 400);
  if (!email || !validator.isEmail(email)) throw new AppError('A valid email is required', 400);
  if (!password || password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  next();
};

export const validateLogin = (req, _res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) throw new AppError('A valid email is required', 400);
  if (!password) throw new AppError('Password is required', 400);

  next();
};

export const validateTranslation = (req, _res, next) => {
  const { text, sourceLanguage = 'auto', targetLanguage } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length < 1) {
    throw new AppError('Text to translate is required', 400);
  }

  if (text.length > 5000) {
    throw new AppError('Text cannot exceed 5000 characters', 400);
  }

  if (!languageCodes.includes(sourceLanguage)) {
    throw new AppError('Unsupported source language', 400);
  }

  if (!targetLanguage || targetLanguage === 'auto' || !languageCodes.includes(targetLanguage)) {
    throw new AppError('A supported target language is required', 400);
  }

  next();
};
