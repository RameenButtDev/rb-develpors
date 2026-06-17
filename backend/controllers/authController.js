const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const createToken = (userId) => {
  return jwt.sign({ id: userId, role: 'Buyer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = createToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        contactNumber: user.contactNumber
      }
    }
  });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return next(new Error(errors.array().map((err) => err.msg).join(', ')));
  }

  const { fullName, email, password, role, profilePicture, contactNumber } = req.body;

  const alreadyExists = await User.findOne({ email });
  if (alreadyExists) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
    profilePicture,
    contactNumber
  });

  sendTokenResponse(user, 201, res);
};

exports.signin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return next(new Error(errors.array().map((err) => err.msg).join(', ')));
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  sendTokenResponse(user, 200, res);
};

exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax'
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};
