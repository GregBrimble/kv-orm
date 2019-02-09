# kv-orm-memory
This is an in-memory datastore plugin for the [kv-orm] package. No data is persisted beyond the lifetime of the instance of `MemoryDatastore`.

Please note, however, this datastore was not designed with security in mind. It is only intended to easily facilitate testing of the [kv-orm] package. 

[![Version](https://img.shields.io/npm/v/kv-orm-memory.svg?logo=npm)](https://www.npmjs.com/package/kv-orm-memory)
[![npm downloads](https://img.shields.io/npm/dt/kv-orm-memory.svg?logo=npm)](https://www.npmjs.com/package/kv-orm-memory)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/kv-orm-memory.svg?logo=npm)](https://www.npmjs.com/package/kv-orm-memory)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/kv-orm-memory.svg?logo=npm)](https://www.npmjs.com/package/kv-orm-memory)
[![License](https://img.shields.io/npm/l/kv-orm-memory.svg)](./LICENSE)
[![types badge](https://img.shields.io/npm/types/kv-orm-memory.svg)](https://www.typescriptlang.org/)

## Installation
`npm install --save kv-orm kv-orm-memory`

## Usage
```typescript
import { BaseEntity, Column, Datastore, Entity } from 'kv-orm';
import { MemoryDatastore } from 'kv-orm-memory';

const memoryDatastore = new MemoryDatastore();

@Entity(memoryDatastore)
class Author extends BaseEntity {
  
  @Column()
  public firstName!: string;

  @Column()
  public lastName!: string;
}

// For more information how to then use Author, check out the kv-orm package
// https://github.com/GregBrimble/kv-orm
```

[kv-orm]: https://github.com/GregBrimble/kv-orm
