import { BaseEntity, Datastore, Entity } from 'kv-orm';
import { MemoryDatastore } from './MemoryDatastore';

describe('MemoryDatastore', () => {
  const memoryDatastore = new MemoryDatastore(':');

  it('can be initialized', () => {
    expect(memoryDatastore).toBeInstanceOf(MemoryDatastore);
  });
  it('can be written to and read from', async () => {
    memoryDatastore.write('key', 'value');
    expect.assertions(1);
    expect(await memoryDatastore.read('key')).toEqual('value');
  });
  it("doesn't error when reading nonexistent keys", async () => {
    expect.assertions(1);
    expect(await memoryDatastore.read('non-existent key')).toBeNull();
  });
  it('can delete stored keys', async () => {
    memoryDatastore.write('temporaryKey', 'temporaryValue');
    expect.assertions(2);
    expect(await memoryDatastore.read('temporaryKey')).toEqual('temporaryValue');
    memoryDatastore.delete('temporaryKey');
    expect(await memoryDatastore.read('temporaryKey')).toBeNull();
  });
  describe('using entities', () => {

    @Entity(memoryDatastore)
    class Author extends BaseEntity {
    }

    @Entity(memoryDatastore)
    class Book extends BaseEntity {
    }

    const author = new Author();
    const book = new Book();

    it('can be accessed', async () => {
      const datastore = (author.constructor as any).datastore as Datastore;
      datastore.write('authorKey', 'authorValue');
      expect.assertions(1);
      expect(await datastore.read('authorKey')).toEqual('authorValue');
    });
    it('persists data between entities', async () => {
      const authorDatastore = (author.constructor as any).datastore as Datastore;
      const bookDatastore = (book.constructor as any).datastore as Datastore;
      authorDatastore.write('sharedKey', 'sharedValue');
      expect.assertions(1);
      expect(await bookDatastore.read('sharedKey')).toEqual('sharedValue');
    });
  });
});
