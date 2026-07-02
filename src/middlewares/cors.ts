import cors from 'cors';
import { config } from '../config/env';

const allowedOrigins = config.corsOrigin === '*' 
  ? '*' 
  : config.corsOrigin.split(',').map(origin => origin.trim());

export const corsOptions = cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Total-Pages'],
  credentials: true,
  maxAge: 86400, // 24 heures
});

// Middleware pour ajouter des headers CORS supplémentaires
export const corsHeaders = (_req: any, res: any, next: any) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};
