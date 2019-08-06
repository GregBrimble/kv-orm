import { BaseEntity, BaseEntityPrivate, SearchStrategy } from '..';
import { paginateDatastoreSearch } from '../utils';

export function OneToOne<T extends BaseEntity>(this: BaseEntity & any, relationType: typeof BaseEntity) {
  return (target: T, key: string): void => {
    if (!delete this[key]) {
      throw new Error(`Could not setup the OneToOne Relationship, ${key}, on ${target}.`);
    }

    Object.defineProperty(target, key, {
      enumerable: true,
      async get(this: BaseEntityPrivate): Promise<BaseEntity | null> {
        const datastore = this.__meta.datastore;
        if (this.__meta.properties[key] !== undefined) {
          return this.__meta.properties[key];
        } else {
          const prefix = datastore.generateSearchTerm(this, key, relationType);
          const results = await paginateDatastoreSearch(datastore, {
            term: prefix,
            strategy: SearchStrategy.prefix
          });

          let relation;
          if (results.keys.length > 1) {
            throw new Error(
              `More than one relation found in OneToOne Relationship, ${key} on ${target}: ${results.keys.toString()}`
            );
          } else if (results.keys.length === 1) {
            // @ts-ignore
            relation = await relationType.get(datastore.extractUUIDFromKey(prefix, results.keys[0]));
          }

          this.__meta.properties[key] = relation;
          return this.__meta.properties[key];
        }
      },
      set(this: BaseEntityPrivate, relation: BaseEntity | null): void {
        const datastore = this.__meta.datastore;

        const prefix = datastore.generateSearchTerm(this, key, relationType);
        paginateDatastoreSearch(datastore, {
          term: prefix,
          strategy: SearchStrategy.prefix
        }).then(results => {
          for (const key of results.keys) {
            if (relation === null || relation.uuid !== datastore.extractUUIDFromKey(prefix, key)) {
              datastore.delete(key);
            }
          }
        });

        if (relation !== null) {
          datastore.write(datastore.generateKey(this, key, relation), datastore.generateKey(relation));
        }

        if ((this.constructor as any).__meta !== undefined) {
          for (const i of (this.constructor as any).__meta.instances.filter((i: BaseEntity) => i.uuid === this.uuid)) {
            i.__meta.properties[key] = relation;
          }
        }

        this.__meta.properties[key] = relation;
      }
    });
  };
}
