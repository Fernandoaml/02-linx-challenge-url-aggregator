import ReadDumpFileService from '@shared/services/ReadDumpFileService';
import ProductsStandardizationService from './ProductsStandardizationService';

let productsStandardizationService: ProductsStandardizationService;
let readDumpFileService: ReadDumpFileService;

describe('ProductsStandardizationService', () => {
  beforeEach(async () => {
    productsStandardizationService = new ProductsStandardizationService();
    readDumpFileService = new ReadDumpFileService();
  });

  it('Should be able resolve all tasks on challege and return data on api.', async () => {
    const dumpData = await readDumpFileService.execute();
    const data = await productsStandardizationService.execute(dumpData);

    expect(data.length).toBeGreaterThan(0);
    // expect(1 + 1).toBe(2);
  });
});
