import 'reflect-metadata';
import { injectable } from 'tsyringe';

import CreateProductService from './CreateProductService';
import CreateProductCacheService from './CreateProductCacheService';

interface IChunkedData {
  productId: string;
  image: string;
}

@injectable()
class ProductsStandardizationService {
  public async execute(
    chunkedData: string[],
    service: CreateProductService | CreateProductCacheService,
  ): Promise<void> {
    const inquiredProducts = chunkedData.map(async (product: string) => {
      const { productId, image }: IChunkedData = JSON.parse(product);
      await service.execute({ productId, image });
    });
    await Promise.all(inquiredProducts);
  }
}
export default ProductsStandardizationService;
