import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface ICacheData {
  [key: string]: any;
}

export const dataList: any[] = [];

export default class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
    if (key !== '404-Products-List') {
      dataList.push(value);
    }
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }

  public async recoverAll(): Promise<any> {
    // console.log(dataList);
    return dataList;
  }
}
