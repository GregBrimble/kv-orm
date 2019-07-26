import { BaseEntity, Datastore } from '..';

export function OneToOne(type: typeof BaseEntity) {
  return (target: object, key: string) => {
    const constructor = target.constructor as any;
    constructor.properties = constructor.properties || [];
    (constructor.properties as object[]).push({
      key,
      type: OneToOne
    });

    // @ts-ignore
    if (delete this[key]) {
      Object.defineProperty(target, key, {
        enumerable: true,
        async get(this: any): Promise<any> {
          const datastore = this.constructor.datastore as Datastore;
          const relationUUID = await datastore.read(datastore.generateKey(this, key));
          if (relationUUID) {
            return await type.get(relationUUID);
          } else {
            return Promise.resolve(null);
          }
        },
        set(this: any, value: BaseEntity) {
          const datastore = this.constructor.datastore as Datastore;
          datastore.write(datastore.generateKey(this, key), value.uuid);
        }
      })
    }
  }
}
