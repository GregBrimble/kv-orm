# kv-orm-cf-workers
A [Cloudflare Workers KV](https://www.cloudflare.com/products/workers-kv/) datastore plugin for [kv-orm]. // MORE INFO 

[![Version](https://img.shields.io/npm/v/kv-orm-cf-workers.svg?logo=npm)](https://www.npmjs.com/package/kv-orm-cf-workers)
[![npm downloads](https://img.shields.io/npm/dt/kv-orm-cf-workers.svg?logo=npm)](https://www.npmjs.com/package/kv-orm-cf-workers)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/kv-orm-cf-workers.svg?logo=npm)](https://www.npmjs.com/package/kv-orm-cf-workers)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/kv-orm-cf-workers.svg?logo=npm)](https://www.npmjs.com/package/kv-orm-cf-workers)
[![License](https://img.shields.io/npm/l/kv-orm-cf-workers.svg)](./LICENSE)
[![types](https://img.shields.io/npm/types/kv-orm-cf-workers.svg)](https://www.typescriptlang.org/)

## Installation
`npm install --save kv-orm kv-orm-cf-workers`

## Usage
```typescript
import { BaseEntity, Column, Datastore, Entity } from 'kv-orm';
import { CloudflareWorkersKVDatastore } from 'kv-orm-cf-workers';

// NAMESPACE STUFF

const cfWorkersKVDatastore = new CloudflareWorkersKVDatastore();

@Entity(cfWorkersKVDatastore)
class Author extends BaseEntity {
  
  @Column()
  public firstName!: string;

  @Column()
  public lastName!: string;
}

// For more information how to then use Author, check out the kv-orm package:
// https://github.com/GregBrimble/kv-orm
```

## Limitations
* *-to-many Relationships are limited to 4000 instances. It may be possible to overcome this limitation by having tree-like 'spaces' to contain multiple sets of children (untested!). 

[kv-orm]: https://github.com/GregBrimble/kv-orm
