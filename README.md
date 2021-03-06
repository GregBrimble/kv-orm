# kv-orm

[kv-orm] is an [object-relational mapper](https://en.wikipedia.org/wiki/Object-relational_mapping) for [key-value datastores](https://en.wikipedia.org/wiki/Key-value_database).

**Warning! This package is still in active development.**

_Tooling & Infrastructure_

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![Greenkeeper](https://badges.greenkeeper.io/GregBrimble/kv-orm.svg)](https://greenkeeper.io/)
[![Commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

_Source Code_

[![Maintainability](https://api.codeclimate.com/v1/badges/af22a9514da95ae6ff6c/maintainability)](https://codeclimate.com/github/GregBrimble/kv-orm/maintainability)
[![codecov](https://codecov.io/gh/GregBrimble/kv-orm/branch/master/graph/badge.svg)](https://codecov.io/gh/GregBrimble/kv-orm)
[![License](https://img.shields.io/github/license/gregbrimble/kv-orm.svg)](./LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/gregbrimble/kv-orm.svg?logo=github)](https://github.com/GregBrimble/kv-orm)
[![GitHub code size](https://img.shields.io/github/languages/code-size/gregbrimble/kv-orm.svg?logo=github)](https://github.com/GregBrimble/kv-orm)
[![GitHub repo size](https://img.shields.io/github/repo-size/gregbrimble/kv-orm.svg?logo=github)](https://github.com/GregBrimble/kv-orm)

## Features

- Support for multiple key-value datastores in a single application.

  ```typescript
  import { MemoryDatastore } from "kv-orm-memory";

  const libraryDatastore = new MemoryDatastore();
  const applicationSecrets = new MemoryDatastore();
  ```

- Easy construction of typed entities using [Typescript](https://www.typescriptlang.org/).

  ```typescript
  import { BaseEntity, Column, Entity } from "kv-orm";

  @Entity(libraryDatastore)
  class Author extends BaseEntity {
    @Column()
    public firstName!: string;

    @Column()
    public lastName!: string;

    // ...
  }
  ```

- On-demand, lazy-loading: [kv-orm] won't load properties of a model until they're needed, and will do so seamlessly at the time of lookup.

  ```typescript
  let author = Author.get("bbed05da-594e-41d4-9b97-423343543e16"); // 1ms - no properties of the author have been loaded

  console.log(await author.firstName); // 60ms - author.firstName is fetched
  ```

- No unnecessary reads: if a property is already in memory, [kv-orm] won't look it up again unless it needs to.

  ```typescript
  let author = Author.get("0486b183-270d-408a-a274-49b45c418c48");

  console.log(await author.lastName); // 60ms - author.lastName is fetched
  console.log(await author.lastName); // 1ms - author.lastName is retrieved from memory (no lookup performed)
  ```

- Writes and deletes are completed in the background — allowing your application to get on with what it needs to.

  ```typescript
  let author = Author.get("4bc148c5-af48-46ff-a620-3246efc69d91");

  author.firstName = "Ernest";
  // Do more, immediately!
  ```

## Supported Datastores

- In-memory with [kv-orm-memory]
- [Cloudflare Workers KV](https://www.cloudflare.com/products/workers-kv/) with [kv-orm-cf-workers]

If there is any other datastore that you'd like to see supported, please [create an issue](https://github.com/GregBrimble/kv-orm/issues/new), or [make a pull request](https://github.com/GregBrimble/kv-orm/fork).

## Roadmap

[![Open bugs](https://img.shields.io/github/issues-raw/GregBrimble/kv-orm/bug.svg?colorB=%23d73a4a&logo=github)](https://github.com/GregBrimble/kv-orm/labels/bug)
[![Open bugs](https://img.shields.io/github/issues-raw/GregBrimble/kv-orm/enhancement.svg?colorB=%23a2eeef&logo=github)](https://github.com/GregBrimble/kv-orm/labels/enhancement)
[![Open bugs](https://img.shields.io/github/issues-raw/GregBrimble/kv-orm/far%20future.svg?colorB=%23c4c6ff&logo=github)](https://github.com/GregBrimble/kv-orm/labels/far%20future)

### Packages

- [kv-orm](https://github.com/GregBrimble/kv-orm/projects/2)
- [kv-orm-memory](https://github.com/GregBrimble/kv-orm/projects/3)
- [kv-orm-cf-workers](https://github.com/GregBrimble/kv-orm/projects/4)

### Other

- [Tooling & Infrastructure](https://github.com/GregBrimble/kv-orm/projects/1)

## Development

1. Clone this repository: `git clone git@github.com:GregBrimble/kv-orm.git`
1. Install the core packages: `npm install`
1. Setup:
   1. `lerna bootstrap`
   1. `lerna run build`

### Linting

`npm run lint && lerna run lint`

And to automatically fix most problems: `npm run format & lerna run format`

### Tests

`lerna run test`

### Reset

To start from scratch, and get back to a working state with syslinks etc.:

1. `lerna run clean`
1. `npm run clean:node && lerna run clean:node`
1. `npm install`
1. `lerna bootstrap`
1. `lerna run build`

[kv-orm]: https://github.com/GregBrimble/kv-orm
[kv-orm-core]: packages/kv-orm/README.md
[kv-orm-memory]: packages/kv-orm-memory/README.md
[kv-orm-cf-workers]: packages/kv-orm-cf-workers/README.md
