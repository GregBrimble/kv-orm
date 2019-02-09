# kv-orm-memory
This is an in-memory datastore plugin for the [kv-orm] package. No data is persisted beyond the lifetime of the instance of `MemoryDatastore`.

Please note, however, this datastore was not designed with security in mind. It is only intended to easily facilitate testing of the [kv-orm] package. 

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

// For more information how to then use Author, checkout the kv-orm package
// https://github.com/GregBrimble/kv-orm
```

[kv-orm]: https://github.com/GregBrimble/kv-orm
