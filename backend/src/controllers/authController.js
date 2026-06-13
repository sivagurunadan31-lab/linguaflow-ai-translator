import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';
import { demoStore, isDemoMode } from '../utils/demoStore.js';

const authResponse = (user) => ({
  user: user.toSafeObject(),
  token: signToken(user)
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (isDemoMode()) {
    const user = await demoStore.createUser({ name, email, password });
    return res.status(201).json(authResponse(user));
  }
  const user = await User.create({ name, email, password });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = isDemoMode() ? await demoStore.findUserByEmail(email) : await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  res.json(authResponse(user));
});

export const profile = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});
