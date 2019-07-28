import { v4 } from 'uuid/interfaces';
import { BaseEntityPrivate, BaseEntity } from '../Entity';
import { uuid } from '../utils';

export function UUIDColumn(this: BaseEntityPrivate & any) {
  return (target: object, key: keyof BaseEntity) => {
    if (!delete this[key]) {
      throw new Error(`Could not setup the UUIDColumn, ${key}, on ${target}.`);
    }

    Object.defineProperty(target, key, {
      enumerable: true,
      get(this: BaseEntityPrivate): v4 {
        this.__meta.properties.uuid = this.__meta.properties.uuid || uuid();
        return this.__meta.properties.uuid;
      },
      set(this: any, value: v4): void {
        this.__meta.properties.uuid = value;
      }
    });
  };
}
