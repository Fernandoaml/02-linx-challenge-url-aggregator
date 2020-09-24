import 'reflect-metadata';
import { injectable } from 'tsyringe';
import removeEmptyLines from 'remove-blank-lines';
import chunk from 'chunk';

import api from '@shared/infra/services/AggregatorAPI';

interface IChunkedData {
  productId: string;
  image: string;
}

interface IOutputData {
  productId: string;
  image: string[];
}
const productsList: IOutputData[] = [];

async function apiQuery(image: string): Promise<boolean> {
  try {
    await api.get(image);
    return true;
  } catch {
    return false;
  }
}

async function standardization(products: any[]) {
  const inquiredProducts = products.map(async product => {
    await removeEmptyLines(product);
    const { productId, image }: IChunkedData = JSON.parse(product);

    const verifyValue = productsList.findIndex(i => i.productId === productId);
    if (verifyValue === -1) {
      const searchedData = await apiQuery(image);
      if (!searchedData) {
        return;
      }
      productsList.push({
        productId,
        image: [image],
      });
    }
    const productIndex = productsList.findIndex(i => i.productId === productId);
    if (productsList[productIndex].image.length < 3) {
      for (
        let ImgIndex = 0;
        ImgIndex < productsList[productIndex].image.length;
        ImgIndex++
      ) {
        if (productsList[productIndex].image[ImgIndex] === image) {
          return;
        }
        // eslint-disable-next-line no-await-in-loop
        const searchedData = await apiQuery(image);
        if (searchedData) {
          if (productsList[productIndex].image.length < 3) {
            productsList[productIndex].image.push(image);
          }
        }
      }
    }
  });
  await Promise.all(inquiredProducts);
}

@injectable()
class ProductsStandardizationService {
  public async execute(chunkedData: any[][]): Promise<any> {
    const inquiredChunked = chunkedData.map(async products => {
      const splitedProducts = chunk(products, 4);
      await Promise.all([
        standardization(splitedProducts[0]),
        standardization(splitedProducts[1]),
        standardization(splitedProducts[2]),
        standardization(splitedProducts[3]),
        standardization(splitedProducts[4]),
        standardization(splitedProducts[5]),
      ]);
    });
    await Promise.all(inquiredChunked);
    return productsList;
  }
}
export default ProductsStandardizationService;
