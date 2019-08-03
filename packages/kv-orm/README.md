# kv-orm
This is the core [kv-orm] package.

[![Version](https://img.shields.io/npm/v/kv-orm.svg?logo=npm)](https://www.npmjs.com/package/kv-orm)
[![npm downloads](https://img.shields.io/npm/dt/kv-orm.svg?logo=npm)](https://www.npmjs.com/package/kv-orm)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/kv-orm.svg?logo=npm)](https://www.npmjs.com/package/kv-orm)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/kv-orm.svg?logo=npm)](https://www.npmjs.com/package/kv-orm)
[![License](https://img.shields.io/npm/l/kv-orm.svg)](./LICENSE)
[![types](https://img.shields.io/npm/types/kv-orm.svg)](https://www.typescriptlang.org/)

## Installation
`npm install --save kv-orm`

> Note: [a datastore is required to use kv-orm](#Datastores).

## Usage
### Entities
Two things are required to create a [kv-orm] entity from an [ES6 class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes):
* You must wrap the class with the `@Entity(datastore: Datastore)` decorator.
* The class must extend `BaseEntity`.

This class can then be instantiated, which automatically assigns it a [UUID] (see [below](#UUIDColumn) for more information about UUIDs).

```typescript
import { BaseEntity, Column, Entity } from 'kv-orm';
import { MemoryDatastore } from 'kv-orm-memory';

const libraryDatastore = new MemoryDatastore();

@Entity(libraryDatastore)
class Author extends BaseEntity {
  // ...
}

const author = new Author();
```

> Note: an Entity's constructor is **not** called when fetching an instance (e.g. with [`get(uuid: string)`](#Get)).
> This is so that data is not lost if any class properties would be overwritten in the constructor method.

#### Get
A static `get(uuid: string)` method is injected into the Entity. This allows you to `await` a class instance with with a given [UUID].

```typescript
const foundAuthor = await Author.get('c2e1ed7e-256d-43fb-a1a3-ef22be355d58');

console.log(foundAuthor.uuid);    // c2e1ed7e-256d-43fb-a1a3-ef22be355d58
```

### Columns
Using the `@Column()` decorator on a class property is how you mark it as a savable property to [kv-orm]. These properties are immediately set-able, but to get them, you must `await` their value.

```typescript
@Entity(libraryDatastore)
class Author extends BaseEntity {

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  public someUnsavedProperty: any;
}

const author = new Author();

// Saves the properties in libraryDatastore
author.firstName = 'William';
author.lastName = 'Shakespeare';

// When in an async function, you can fetch the value with `await`
(async () => {
  const firstName = await author.firstName;
})();

// Or, use `Promise.then()`...
author.lastName.then(value => {
  const lastName = value;
});
```

#### UUIDColumn
A [UUID] is a 32-hex-character Universally Unique I\[D]entifier.
 
In order to differentiate instances in the datastore, a `@UUIDColumn()` (`uuid`) gets injected onto every `Entity` class. The `Entity.uuid` property can be accessed immediately (no `await` required), as it is always stored in memory.

```typescript
const author = new Author();

console.log(author.uuid);   // 0fa8e341-8c7e-49ad-8883-342b67c22879
```

> Note: while the `uuid` property can be overwritten, it is not advised.
> The instance data with the previous UUID will still exist in the datastore (unless manually deleted),
> and the new instance will not have any properties saved until the property values are manually re-set.  

#### Property Getters/Setters
If your property is particularly complex (can't be stored natively in the datastore), you may wish to use a property getter/setter for a `Column`, to allow you to serialize it before saving in the datastore. 

For example, let's say you have a complex property, `Author.somethingComplex`:
```typescript
@Entity(libraryDatastore)
class Author extends BaseEntity {
  @Column()
  private _complex: string;   // place to store serialized value of somethingComplex

  set somethingComplex(value: any) {
    this._complex = serialize(value);   // function serialize(value: any): string
  }
  get somethingComplex(): any {
    return (async () => deserialize(await this._complex))();    // function deserialize(serializedValue: string): any
  }
}
```

> Note: the getter above is still returning a Promise, as normal. You still must `await` the value of `somethingComplex`.

### Relationships
#### One-to-one
Coming soon!

#### One-to-many
Coming soon!


## Datastores
In order to use [kv-orm], you will need a datastore. [Several plugin packages exist](../../README.md#Supported-Datastores), but it's easy to create your own, if needed.

You must:
* implement the `read`, `write`, `delete` and `list` methods,
* initialize the parent `Datastore` with a `keySeparator` in the `super` call,
* set the possible `searchStrategies`.

Take a look at [kv-orm-memory] for a really simple example.

Please consider creating a pull request to add another datastore to this repository, if you think it could be of use to others! 

## Limitations
* `Entity` instances and their constructor have a private `__meta` property. Don't directly access, or override, it.
* Overriding the `uuid` property on an `Entity` instance is not recommended. See the note [above](#UUIDColumn).

[kv-orm]: https://github.com/GregBrimble/kv-orm
[kv-orm-memory]: ../kv-orm-memory/README.md
[UUID]: https://en.wikipedia.org/wiki/Universally_unique_identifier
