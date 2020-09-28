import 'reflect-metadata';

import { Request, Response } from 'express';
import 'express-async-errors';
import { classToClass } from 'class-transformer';

import { productsList } from '@modules/products/services/TriggerToProcessProducts';
import AppError from '@shared/errors/AppErrors';

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    if (productsList.length === 0) {
      throw new AppError(
        "We  don't have all of data yet. Please try again later",
        401,
      );
    }
    return response.json(classToClass(productsList));
  }
}
