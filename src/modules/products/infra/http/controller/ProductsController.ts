import { Request, Response } from 'express';
import 'express-async-errors';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

// import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
// import VerifyProductsService from '@modules/products/services/VerifyProductsService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { ip } = request;
    // const product = {
    //   products: request.body,
    //   ip,
    //   fullDate: Date.now(),
    // } as ICreateProductsDTO;

    // const verifyTheRequestService = container.resolve(VerifyProductsService);
    // const data = await verifyTheRequestService.execute(product);
    // return response.json(classToClass(data));
    return response.json({ ok: 'OK' });
  }
}
