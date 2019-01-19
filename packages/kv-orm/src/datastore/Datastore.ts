import { BaseEntity } from '../Entity';

export abstract class Datastore {
  public constructor(private keySeparator: string = ':') {}

  public abstract read(key: string): Promise<any>;

  public abstract write(key: string, value: any): void;

  public abstract delete(key: string): void;

  public generateKey(instance: BaseEntity, key: string) {
    return [(instance.constructor as any).key, instance.uuid, key].join(this.keySeparator);
  }
}

// interface CloudflareWorkersKVNamespace {
//   get(key: string): Promise<any>;
//
//   put(key: string, value: any): void;
//
//   delete(key: string): void;
// }
//
// class CloudflareWorkersKVDatastore extends Datastore {
//   constructor(private namespace: CloudflareWorkersKVNamespace, keySeparator: string = ':') {
//     super(keySeparator);
//   }
//
//   public read(key: string): Promise<any> {
//     return this.namespace.get(key);
//   }
//
//   public write(key: string, value: any): void {
//     this.namespace.put(key, value);
//   }
//
//   public delete(key: string): void {
//     this.namespace.delete(key);
//   }
// }
