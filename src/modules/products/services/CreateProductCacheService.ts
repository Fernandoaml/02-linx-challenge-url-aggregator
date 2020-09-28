import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import api from '@shared/infra/services/AggregatorAPI';

interface IOutputData {
  productId: string;
  image: string[];
}

interface I404Data {
  images: string[];
}

interface IChunkedData {
  productId: string;
  image: string;
}

async function apiQuery(image: string): Promise<boolean> {
  try {
    await api.get(image);
    return true;
  } catch {
    /* istanbul ignore next */
    return false;
  }
}

@injectable()
class CreateProductCacheService {
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

    if (cacheData) {
      if (cacheData.image.length < 3) {
        const imageExists = cacheData.image.findIndex(
          cacheImg => cacheImg === image,
        );
        if (imageExists === -1) {
          if (cache404) {
            const image404Exists = cache404.images.findIndex(
              cacheImg404 => cacheImg404 === image,
            );
            if (image404Exists === -1) {
              const searchedData = await apiQuery(image);

              if (searchedData) {
                cacheData.image.push(image);

                await this.cacheProvider.save(`Products-List:${productId}`, {
                  productId,
                  image: cacheData.image,
                });
              }
              cache404.images.push(image);
              await this.cacheProvider.save(`404-Products-List`, cache404);
            }
          }
        }
      }
    }
  }
}

export default CreateProductCacheService;
