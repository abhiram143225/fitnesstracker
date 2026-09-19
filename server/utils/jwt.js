import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fitness_app_jwt_secret_dev_key_2026_change_me';
const JWT_EXPIRES_IN = '30d';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
