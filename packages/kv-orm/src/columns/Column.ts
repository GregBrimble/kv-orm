import { Datastore } from '..';

export function Column() {
  return (target: object, key: string) => {
    // @ts-ignore
    if (delete this[key]) {
      Object.defineProperty(target, key, {
        enumerable: true,
        async get(this: any): Promise<any> {
          const datastore = this.constructor.datastore as Datastore;
          this[`_${key}`] = this[`_${key}`] || (await datastore.read(datastore.generateKey(this, key)));
          return this[`_${key}`];
        },
        set(this: any, value: string): void {
          const datastore = this.constructor.datastore as Datastore;
          datastore.write(datastore.generateKey(this, key), value);
          this[`_${key}`] = value;
        }
      });
    }
  };
}
