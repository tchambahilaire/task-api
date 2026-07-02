import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../exceptions/AppError';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log complet de l'erreur
  logger.error(`Erreur: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Erreurs Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation échouée',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code,
      })),
    });
  }

  // Erreurs personnalisées
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
      ...(config.isDevelopment && { stack: err.stack }),
    });
  }

  // Erreurs de syntaxe JSON
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'JSON invalide',
      message: 'Le format du JSON envoyé est incorrect.',
    });
  }

  // Erreurs inattendues
  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500 
    ? 'Erreur interne du serveur' 
    : err.message || 'Une erreur est survenue';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.isDevelopment && { stack: err.stack }),
  });
};
