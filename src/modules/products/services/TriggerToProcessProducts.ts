import 'reflect-metadata';

import { injectable, container, inject } from 'tsyringe';

import ReadDumpFileService from '@shared/services/ReadDumpFileService';
import ProductsStandardizationService from '@modules/products/services/ProductsStandardizationService';
import CreateProductService from '@modules/products/services/CreateProductService';
import CreateProductCacheService from '@modules/products/services/CreateProductCacheService';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

export const productsList: any[] = [];

@injectable()
class TriggerToProcessProducts {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<void> {
    const timeStart1: any = new Date();
    const hrstart1: any = process.hrtime();
    const createProductService = new CreateProductService(this.cacheProvider);
    const createProductCacheService = new CreateProductCacheService(
      this.cacheProvider,
    );
    const readDumpFileService = container.resolve(ReadDumpFileService);
    const productsStandardizationService = container.resolve(
      ProductsStandardizationService,
    );

    const dumpData = await readDumpFileService.execute();

    await this.cacheProvider.save(`404-Products-List`, { images: [] });
    const services = [
      createProductService,
      createProductCacheService,
      createProductCacheService,
    ];

    for (let i = 0; i < services.length; i++) {
      for (let a = 0; a < dumpData.length; a++) {
        await productsStandardizationService.execute(dumpData[a], services[i]);
      }
    }

    console.info('TASK ENDED.');
    console.info('--------------------------------');
    const timeEnd1: any = new Date();
    const calcTime1: any = timeEnd1 - timeStart1;
    const hrend1 = process.hrtime(hrstart1);
    console.info(`Execution time: ${calcTime1}ms`);
    console.info(`Execution time (hr): ${hrend1[0]}s ${hrend1[1] / 1000000}ms`);
    console.info('--------------------------------');
    console.info('BUILDING THE JSON TO OUTPUT DATA.');
    const timeStart2: any = new Date();
    const hrstart2: any = process.hrtime();

    const allProducts: string[] = await this.cacheProvider.recoverAll();
    for (let i = 0; i < allProducts.length; i++) {
      const products: any = await this.cacheProvider.recover(allProducts[i]);
      if (products !== null) {
        /* istanbul ignore next */
        if (products.productId) productsList.push(products);
      }
    }
    const timeEnd2: any = new Date();
    const calcTime2: any = timeEnd2 - timeStart2;
    const hrend2 = process.hrtime(hrstart2);
    console.info(`Execution time: ${calcTime2}ms`);
    console.info(`Execution time (hr): ${hrend2[0]}s ${hrend2[1] / 1000000}ms`);
    console.info('--------------------------------');
  }
}

export default TriggerToProcessProducts;
