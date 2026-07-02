import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

export const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Trop de requêtes',
    message: `Vous avez dépassé la limite de ${config.rateLimit.max} requêtes. Veuillez réessayer plus tard.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
  },
  skip: (req) => {
    // Skip rate limiting pour les tests ou certaines IP
    return config.isTest;
  },
});

// Rate limiter plus strict pour les endpoints sensibles
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    error: 'Trop de requêtes',
    message: 'Limite de 20 requêtes par 15 minutes pour les opérations sensibles.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
