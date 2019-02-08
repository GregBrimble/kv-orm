import { UUIDColumn } from './columns/UUIDColumn';
import { Datastore } from './datastore/Datastore';

export function Entity<T extends new (...args: any[]) => {}>(datastore: Datastore): (target: T) => any {
  return (target: T): BaseEntity => {
    const original = target;

    const constructor: any = function(this: any, ...args: any[]): void {
      // TODO: Save default values of an Entity to the database immediately upon creation (values are immediately in memory, but unless changed, don't get saved)
      this.constructor.datastore = datastore;
      this.constructor.key = this.constructor.name;
      original.apply(this, args);
    };

    constructor.prototype = original.prototype;
    Object.assign(constructor, original);

    // TODO: Not a fan of this, and the hacky duplication done in BaseEntity
    constructor.find = function(this: typeof BaseEntity, uuid: string): Promise<T> {
      // TODO: Clear all default values of an Entity so as to not ignore overriding values saved in the database (more truthful than just an Entity default)
      const instance = new (this as any)();
      instance.uuid = uuid;
      return Promise.resolve(instance);
    };

    return constructor;



    console.log('Intentional bad-ness');
  };
}

export abstract class BaseEntity {
  // @ts-ignore
  public static abstract find<T extends BaseEntity>(this: typeof BaseEntity, id: string): Promise<T>;

  @UUIDColumn()
  public uuid!: string;
}

// export abstract class Entity {
//   // private static getDefaultKeyName(instance: Entity) {
//   //     return instance.constructor.name;
//   // }
//
//   // private ID: string;
//   //
//   // public get id(): string {
//   //   this.ID = this.ID || uuidv4();
//   //   return this.ID;
//   // }
//   //
//   //
//   // protected abstract _key: string;
//   protected _ds!: Datastore;
//
//   // constructor(props: Map<string, Property>) {
//   //   // this.key = key || Entity.getDefaultKeyName(this);
//   //   // TODO: Find a more organic way of getting props
//   //   // for (const [key, prop] of props) {
//   //   //   Object.defineProperty(this, key, {
//   //   //     get: async function() {
//   //   //       if (typeof this[prop.key] === 'undefined') {
//   //   //         this[prop.key] = hydrateRelationship(prop, await this._ds.read(prop._key));
//   //   //       }
//   //   //       return prop.get(this[prop.key]);
//   //   //     },
//   //   //     set: async function(value: any) {
//   //   //       value = prop._attrs.set(value);
//   //   //       // TODO: Check allowed types
//   //   //       this[prop._key] = value;
//   //   //       value = desiccateRelationship(prop, value);
//   //   //       await this._ds.write(prop._key, value);
//   //   //     }
//   //   //   });
//   //   // }
//   // }
// }

// -----------------------------------

// function propIsRelationship(prop) {
//   return prop.constructor.prototype instanceof Relationship || prop.constructor === Relationship;
// }
//
// function hydrateRelationship(prop, value) {
//   if (propIsRelationship(prop)) {
//     return prop._type.get(value);
//   }
//   return value;
// }
//
// function desiccateRelationship(prop, value) {
//   if (propIsRelationship(prop)) {
//     return value.id;
//   }
//   return value;
// }
//
// class Model {
//   // TODO: Test nested models/properties
//   // TODO: Test many-to-one, one-to-one, one-to-many, zero-to-.... etc. Relationships
// }
