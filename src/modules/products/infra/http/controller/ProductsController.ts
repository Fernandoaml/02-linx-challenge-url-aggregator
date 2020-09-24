import { Request, Response } from 'express';
import 'express-async-errors';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ReadDumpFileService from '@shared/services/ReadDumpFileService';
import ProductsStandardizationService from '@modules/products/services/ProductsStandardizationService';

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const readDumpFileService = container.resolve(ReadDumpFileService);
    const productsStandardizationService = container.resolve(
      ProductsStandardizationService,
    );
    const dumpData = await readDumpFileService.execute();
    const data = await productsStandardizationService.execute(dumpData);
    return response.json(classToClass(data));
  }
}
