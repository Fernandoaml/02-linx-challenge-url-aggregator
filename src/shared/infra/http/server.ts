import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import cors from 'cors';
import AppError from '@shared/errors/AppErrors';
import routes from '@shared/infra/http/routes';
import TriggerToProcessProducts from '@modules/products/services/TriggerToProcessProducts';

import '@shared/container';
import { container } from 'tsyringe';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }
    console.log(error);
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, async () => {
  console.log('Server started on port 3333');
  const triggerToProcessProducts = container.resolve(TriggerToProcessProducts);
  await triggerToProcessProducts.execute();
});
