const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    status: 'fail',
    message: 'Too many authentication requests from this IP, please try again later.'
  }
});

module.exports = { authLimiter };
