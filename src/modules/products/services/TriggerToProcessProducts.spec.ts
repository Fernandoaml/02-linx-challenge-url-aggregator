import FakeCacheProvider, {
  dataList,
} from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import TriggerToProcessProducts from './TriggerToProcessProducts';

let fakeCacheProvider: FakeCacheProvider;
let triggerToProcessProducts: TriggerToProcessProducts;

describe('Trigger to Start Standardization and to expose data to api', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    triggerToProcessProducts = new TriggerToProcessProducts(fakeCacheProvider);
  });

  it('Should be able to be call 2 processes Services to create the product and the cache theys.', async () => {
    console.info = jest.fn();
    await triggerToProcessProducts.execute();

    const list404: any = await fakeCacheProvider.recover('404-Products-List');

    expect(list404).toBeTruthy();
    expect(list404).toHaveProperty('images');
    expect(console.info).toHaveBeenCalledWith('TASK ENDED.');
    expect(console.info).toHaveBeenCalledWith(
      'BUILDING THE JSON TO OUTPUT DATA.',
    );
    expect(dataList[0]).toHaveProperty('productId');
    expect(dataList[0]).toHaveProperty('image');
  });
});
