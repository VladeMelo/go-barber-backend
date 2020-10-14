import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validação do token JWT

  const { authorization } = request.headers; // authorization é o token

  if (!authorization) {
    throw new AppError('JWT token is missing', 401);
  }

  // it will come like 'Bearer *token*'
  const [type, token] = authorization.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload; // forçar a ser de um tipo

    const { sub } = decoded;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
}