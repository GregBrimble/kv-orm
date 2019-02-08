# kv-orm
[kv-orm] is an [object-relational mapper](https://en.wikipedia.org/wiki/Object-relational_mapping) for [key-value datastores](https://en.wikipedia.org/wiki/Key-value_database).

**Warning! This package is still in active development, and breaking changes are possible and in fact, likely.**

[![Maintainability](https://api.codeclimate.com/v1/badges/af22a9514da95ae6ff6c/maintainability)](https://codeclimate.com/github/GregBrimble/kv-orm/maintainability) [![Greenkeeper badge](https://badges.greenkeeper.io/GregBrimble/kv-orm.svg)](https://greenkeeper.io/)

## Getting Started
See [Getting Started](packages/kv-orm/README.md).

## Features
* On-demand, lazy-loading: [kv-orm] won't load properties of a model until they're needed, and will do so seamlessly at the time of lookup.
  ```javascript
  Entity.
  
  let myBook = Book.get(1); // 1ms - no properties of `book` have been loaded

  console.log(await myBook.title);  // 60ms - myBook.title is fetched 
  ```

* No unnecessary reads: if a property is already in memory, [kv-orm] won't look it up again unless it needs to.
  ```javascript
  let myBook = Book.get(1);
  
  console.log(await myBook.title); memoryDatastore
  console.log(await myBook.title); // 1ms - myBook.title is retrieved from memory (no lookup performed)
  ```
  
* Writes and deletes are completed in the background — allowing your application to get on with what it needs to.
  ```javascript
  let myBook = Book.get(1);
  
  myBook.title = 'Moby Dick'; memoryDatastore
  
  // Do more, immediately!
  ```

* Support for multiple key-value datastores in a single application.
  ```javascript
  let libraryDatastore = cloudflareWorkersKVConnection(LIBRARY);
  let applicationSecrets = cloudflareWorkersKVConnection(COMMON);
  
  class Book extends libraryDatastore(Entity) {
    // ...
  }

  class Config extends applicationSecrets(Entity) {
    // ...
  } 
  ```

## Supported Datastores
* [Cloudflare Workers KV](https://www.cloudflare.com/products/workers-kv/)

If there is any other datastore that you'd like to see supported, please [create an issue](https://github.com/GregBrimble/kv-orm/issues/new).

## Roadmap
### Defined
* Support more datastores
  - Memory (for testing)
  - [window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)?
  - [Redis](https://redis.io/)?
* Error reporting
* Customizable log levels
* Getting started guide/documentation
* Publish on NPM
* Type checking on values
* Organize source code
* Warn about max key/value size
* Custom key generation
  - Existing properties
  - Arbitrary function
* Migration engine
* Continuous Integration/Deployment
* Badges etc. on README

### Vague
* Look into listing the keys, and querying on that?
* Handle `has`? e.g. USERS.has(id = 5)?
* Support backrefs (risk of exponential key duplication?)



[kv-orm]: https://github.com/GregBrimble/kv-orm