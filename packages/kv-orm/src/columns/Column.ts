import { BaseEntity, BaseEntityPrivate } from '..';

export function Column<T extends BaseEntity>(this: BaseEntity & any) {
  return (target: T, key: string): void => {
    if (!delete this[key]) {
      throw new Error(`Could not setup the Column, ${key}, on ${target}.`);
    }

    Object.defineProperty(target, key, {
      enumerable: true,
      async get(this: BaseEntityPrivate): Promise<any> {
        const datastore = this.__meta.datastore;
        if (this.__meta.properties[key] !== undefined) {
          return this.__meta.properties[key];
        } else {
          this.__meta.properties[key] = await datastore.read(datastore.generateKey(this, key));
          return this.__meta.properties[key];
        }
      },
      set(this: BaseEntityPrivate, value: string): void {
        const datastore = this.__meta.datastore;
        datastore.write(datastore.generateKey(this, key), value);
        this.__meta.properties[key] = value;
      }
    });
  };
}
