import { Datastore } from 'kv-orm';

export class MemoryDatastore extends Datastore {
  private data: { [key: string]: any } = {};

  constructor(keySeparator: string = ':') {
    super(keySeparator);
  }

  public read(key: string): Promise<any> {
    return Promise.resolve(this.data[key] || null);
  }

  public write(key: string, value: any): void {
    this.data[key] = value;
  }

  public delete(key: string): void {
    delete this.data[key];
  }
}
