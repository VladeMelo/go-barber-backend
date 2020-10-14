import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

import '@shared/infra/typeorm/index';
import '@shared/container/index';

const app = express();

app.use(cors()); // evita que alguns sites não confiáveis acessem a aplicação
app.use(express.json()); // reconhece as request objects como JSON objects
app.use('/files', express.static(uploadConfig.uploadsFolder)); // carregando arquivos estáticos(ex: imagem, css, q ñ mudam)
app.use(rateLimiter);

app.use(routes);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    return response.status(500 /* um erro mais geral */).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
); // tratativa de erros

app.listen(3333, () => {
  console.log('Server started on port 3333');
});
