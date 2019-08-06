import { BaseEntity, BaseEntityPrivate, SearchStrategy } from '..';
import { paginateDatastoreSearch } from '../utils';

export function OneToMany<T extends BaseEntity>(this: BaseEntity & any, relationType: typeof BaseEntity) {
  return (target: T, key: string): void => {
    if (!delete this[key]) {
      throw new Error(`Could not setup the OneToMany Relationship, ${key}, on ${target}.`);
    }

    Object.defineProperty(target, key, {
      enumerable: true,
      async get(this: BaseEntityPrivate): Promise<BaseEntity[] | null> {
        const datastore = this.__meta.datastore;
        if (this.__meta.properties[key] !== undefined) {
          return this.__meta.properties[key];
        } else {
          const prefix = datastore.generateSearchTerm(this, key, relationType);
          const results = await paginateDatastoreSearch(datastore, {
            term: prefix,
            strategy: SearchStrategy.prefix
          });

          let relations: BaseEntity[] = [];
          for (const key of results.keys) {
            // @ts-ignore
            relations.push(await relationType.get(datastore.extractUUIDFromKey(prefix, key)));
          }

          this.__meta.properties[key] = relations;
          return this.__meta.properties[key];
        }
      },
      set(this: BaseEntityPrivate, relations: BaseEntity[]): void {
        const datastore = this.__meta.datastore;

        const newUUIDs = relations.map(relation => relation.uuid);

        const prefix = datastore.generateSearchTerm(this, key, relationType);
        paginateDatastoreSearch(datastore, {
          term: prefix,
          strategy: SearchStrategy.prefix
        }).then(results => {
          for (const key of results.keys) {
            if (!newUUIDs.includes(datastore.extractUUIDFromKey(prefix, key))) {
              datastore.delete(key);
            }
          }
        });

        for (const relation of relations) {
          datastore.write(datastore.generateKey(this, key, relation), datastore.generateKey(relation));
        }

        if ((this.constructor as any).__meta !== undefined) {
          for (const i of (this.constructor as any).__meta.instances.filter((i: BaseEntity) => i.uuid === this.uuid)) {
            i.__meta.properties[key] = relations;
          }
        }

        this.__meta.properties[key] = relations;
      }
    });
  };
}
