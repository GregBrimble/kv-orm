import { Datastore } from 'kv-orm';

export interface ICloudflareWorkersKVNamespace {
  get(key: string): Promise<any>;

  put(key: string, value: any): void;

  delete(key: string): void;
}

export class CloudflareWorkersKVDatastore extends Datastore {
  constructor(private namespace: ICloudflareWorkersKVNamespace, keySeparator: string = ':') {
    super(keySeparator);
  }

  public read(key: string): Promise<any> {
    return this.namespace.get(key);
  }

  public write(key: string, value: any): void {
    this.namespace.put(key, value);
  }

  public delete(key: string): void {
    this.namespace.delete(key);
  }
}
