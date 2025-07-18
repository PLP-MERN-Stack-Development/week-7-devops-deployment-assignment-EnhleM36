// backend/config/jwt.js
module.exports = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_development',
  expire: process.env.JWT_EXPIRE || '30d',
  cookieExpire: process.env.JWT_COOKIE_EXPIRE || 30,
};