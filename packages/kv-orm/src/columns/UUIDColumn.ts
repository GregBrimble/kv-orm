import { v4 } from 'uuid/interfaces';
import { uuid } from '../utils';

export function UUIDColumn() {
  return (target: object, key: string) => {
    // @ts-ignore
    if (delete this[key]) {
      Object.defineProperty(target, key, {
        enumerable: true,
        get(this: any) {
          this._uuid = this._uuid || uuid();
          return this._uuid;
        },
        set(this: any, value: v4) {
          this._uuid = value;
        }
      });
    }
  };
}
