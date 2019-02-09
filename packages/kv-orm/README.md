# kv-orm
This is the core [kv-orm] package.

[![Version](https://img.shields.io/npm/v/kv-orm.svg?logo=npm)](https://www.npmjs.com/package/kv-orm)
[![npm downloads](https://img.shields.io/npm/dt/kv-orm.svg?logo=npm)](https://www.npmjs.com/package/kv-orm)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/kv-orm.svg?logo=npm)](https://www.npmjs.com/package/kv-orm)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/kv-orm.svg?logo=npm)](https://www.npmjs.com/package/kv-orm)
[![License](https://img.shields.io/npm/l/kv-orm.svg)](./LICENSE)
[![types badge](https://img.shields.io/npm/types/kv-orm.svg)](https://www.typescriptlang.org/)

## Installation
`npm install --save kv-orm`

## Usage
### Entities
...

### Relationships
#### One-to-one
Coming soon!

#### One-to-many
Coming soon!


## Datastores
In order to use [kv-orm], you will need a datastore. [Several plugin packages exist](../../README.md#Supported-Datastores), but it's easy to create your own, if needed.

You must implement the `read`, `write`, and `delete` methods, as well as pass a `keySeparator` to `Datastore`.

The following example is the code of [kv-orm-memory]:

```typescript
import { Datastore } from 'kv-orm';

export class MemoryDatastore extends Datastore {
  private data: { [key: string]: any } = {};

  constructor(keySeparator: string = ':') {
    super(keySeparator);
  }

  public read(key: string): Promise<any> {
    return Promise.resolve(this.data[key] || null);
  }

  public write(key: string, value: any): void {
    this.data[key] = value;
  }

  public delete(key: string): void {
    delete this.data[key];
  }
}
```

Please consider creating a pull request to add your custom datastore to this repository, if you think it could be of use to others! 

[kv-orm]: https://github.com/GregBrimble/kv-orm
[kv-orm-memory]: ../kv-orm-memory/README.md
