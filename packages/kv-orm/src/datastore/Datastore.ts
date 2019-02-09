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

