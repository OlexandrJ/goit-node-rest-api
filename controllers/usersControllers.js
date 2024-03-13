import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import gravatar from 'gravatar';
import fs from 'fs/promises';
import jimp from 'jimp';
import { nanoid } from 'nanoid';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw HttpError(409, 'Email in use');
    }
    const avatarURL = gravatar.url(email, { protocol: 'https', s: '250' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, avatarURL });
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

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, 'Avatar file is required');
    }
    const userId = req.user._id;
    const { filename } = req.file;
    const user = await User.findById(userId);
    if (!user) {
      throw HttpError(404, 'User not found');
    }

    const image = await jimp.read(req.file.path);
    await image.cover(250, 250).writeAsync(req.file.path);

    const avatarPath = `public/avatars/${filename}`;
    const avatarURL = `avatars/${filename}`;
    
    await fs.rename(req.file.path, avatarPath);
    user.avatarURL = avatarURL;
    await user.save();

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, 'User not found');
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, 'User not found');
    }

    if (user.verify) {
      throw HttpError(400, 'Verification has already been passed');
    }

    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};
