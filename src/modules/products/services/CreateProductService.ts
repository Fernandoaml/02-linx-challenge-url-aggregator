import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import api from '@shared/infra/services/AggregatorAPI';

interface IOutputData {
  productId: string;
  image: string[];
}
interface IChunkedData {
  productId: string;
  image: string;
}

interface I404Data {
  images: string[];
}

async function apiQuery(image: string): Promise<boolean> {
  try {
    await api.get(image);
    return true;
  } catch {
    return false;
  }
}

@injectable()
class CreateProductService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ productId, image }: IChunkedData): Promise<void> {
    const cacheData = await this.cacheProvider.recover<IOutputData>(
      `Products-List:${productId}`,
    );
    const cache404 = await this.cacheProvider.recover<I404Data>(
      '404-Products-List',
    );
    if (!cacheData) {
      const searchedData = await apiQuery(image);
      if (searchedData) {
        const data = {
          productId,
          image: [image],
        };
        await this.cacheProvider.save(`Products-List:${productId}`, data);
      }
      if (cache404) {
        const image404Exists = cache404.images.findIndex(
          /* istanbul ignore next */
          cacheImg404 => cacheImg404 === image,
        );
        if (image404Exists === -1) {
          cache404.images.push(image);
          await this.cacheProvider.save(`404-Products-List`, cache404);
        }
      }
    }
  }
}

export default CreateProductService;
