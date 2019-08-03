import { UUIDColumn } from './columns/UUIDColumn';
import { Datastore } from './datastore/Datastore';

interface EntityMeta {
  datastore: Datastore;
  key: string;
  properties: { [key: string]: any };
}

export interface BaseEntityPrivate {
  __meta: EntityMeta;
  uuid: string;
}

export function Entity(datastore: Datastore) {
  // Pretty hacky constructor mixin. I need to learn more about prototyping
  // and how the ES6 syntax sugar works behind-the-scenes before I can improve this any further.
  // The API works well enough though, and that's the most important bit to continue building new things.
  return <T extends new (...args: any[]) => {}>(constructor: T): T => {
    const original = constructor;

    const c = function(this: any, ...args: any[]) {
      c.__meta.createInstanceMeta(this);
      original.apply(this, args);
    };

    c.__meta = {
      createInstanceMeta: function createMeta(i: new (...args: any[]) => {}) {
        Object.defineProperty(i, '__meta', {
          writable: true,
          value: {
            datastore,
            key: i.constructor.name,
            properties: {}
          }
        });
      }
    };

    Object.assign(c, original);
    c.prototype = Object.create(original.prototype);
    c.get = (original as any).get;

    // @ts-ignore
    return c;
  };
}

export abstract class BaseEntity {
  public static get<T extends BaseEntity>(this: new (...args: any[]) => T, uuid: string): Promise<T> {
    const i = Object.create(this.prototype);
    (this as any).__meta.createInstanceMeta(i);
    i.uuid = uuid;
    return Promise.resolve(i);
  }

  @UUIDColumn()
  public uuid!: string;
}
