import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw HttpError(409, 'Email in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw HttpError(401, 'Email or password is wrong');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    await user.save();
    res.json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    res.json({ email: req.user.email, subscription: req.user.subscription });
  } catch (error) {
    next(error);
  }
};
