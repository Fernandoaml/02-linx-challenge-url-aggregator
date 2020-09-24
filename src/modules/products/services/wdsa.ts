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
const productsList: IOutputData[] = [{ productId: '', image: [''] }];

async function apiQuery(image: string): Promise<boolean> {
  try {
    await api.get(image);
    return true;
  } catch {
    return false;
  }
}

@injectable()
class ProductsStandardizationService {
  public async execute(chunkedData: any[][]): Promise<void> {
    chunkedData.map(async products => {
      // console.log(products.length);
      const inquiredProducts = products.map(async product => {
        await removeEmptyLines(product);
        const { productId, image }: IChunkedData = JSON.parse(product);
        // const test = productsList.findIndex(i => i.productId === productId);
        // console.log(test);
        console.log(productsList);
        for (let index = 0; index < productsList.length; index++) {
          const productExistis = productsList[index].productId === productId;
          if (!productExistis) {
            if (productsList.findIndex(i => i.productId === productId) === -1) {
              // eslint-disable-next-line no-await-in-loop
              const searchedData = await apiQuery(image);

              if (searchedData) {
                productsList.push({
                  productId,
                  image: [image],
                });
              }
            }
          }
          if (productExistis) {
            const productIndex = productsList.findIndex(
              i => i.productId === productId,
            );
            if (productsList[productIndex].image.length > 3) {
              return;
            }

            for (
              let ImgIndex = 0;
              ImgIndex < productsList[index].image.length;
              ImgIndex++
            ) {
              if (productsList[index].image[ImgIndex] === image) {
                return;
              }
              // eslint-disable-next-line no-await-in-loop
              const searchedData = await apiQuery(image);
              if (productsList[productIndex].image.length < 3) {
                if (searchedData) {
                  productsList[productIndex].image.push(image);
                }
              }
            }
          }
        }
        // const productIndex = productsList.findIndex(i =>
        //   console.log(i.productId),
        // );
        // console.log(productIndex);
        // if (productsList.findIndex(i => i.productId === productId) === -1) {
        //   console.log('AQUI');
        //   const queryData = await apiQuery(image).then();
        //   console.log('AQUI2');
        //   console.log(queryData);
        //   if (queryData) {
        //     productsList.push({
        //       productId,
        //       image: [image],
        //     });
        //   }
        //   // if (productsList[productIndex].image.length < 3) {
        //   //   const existImage = await apiQuery(image);
        //   //   if (existImage) {
        //   //     productsList[productIndex].image.push(image);
        //   //     console.log(productIndex);
        //   //   }
        //   // }
        // }
        // else {
        //   const queryData = await apiQuery(image);
        //   if (queryData) {
        //     productsList.push({
        //       productId,
        //       image: [image],
        //     });
        //   }
        // }
      });
      await Promise.all(inquiredProducts);
      productsList.splice(0, 1);
      // console.log(productsList);
    });
  }
}
export default ProductsStandardizationService;
