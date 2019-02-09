import { BaseEntity, Datastore, Entity } from 'kv-orm';
import { MemoryDatastore } from './MemoryDatastore';

describe('MemoryDatastore', () => {
  const memoryDatastore = new MemoryDatastore(':');

  it('can be initialized', () => {
    expect(memoryDatastore).toBeInstanceOf(MemoryDatastore);
  });
  it('can be written to and read from', () => {
    memoryDatastore.write('key', 'value');
    expect.assertions(1);
    expect(memoryDatastore.read('key')).resolves.toEqual('value');
  });
  it("doesn't error when reading nonexistent keys", () => {
    expect.assertions(1);
    expect(memoryDatastore.read('non-existent key')).resolves.toBeNull();
  });
  it('can delete stored keys', () => {
    memoryDatastore.write('temporaryKey', 'temporaryValue');
    expect.assertions(2);
    expect(memoryDatastore.read('temporaryKey')).resolves.toEqual('temporaryValue');
    memoryDatastore.delete('temporaryKey');
    expect(memoryDatastore.read('temporaryKey')).resolves.toBeNull();
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

    it('can be accessed', () => {
      const datastore = (author.constructor as any).datastore as Datastore;
      datastore.write('authorKey', 'authorValue');
      expect.assertions(1);
      expect(datastore.read('authorKey')).resolves.toEqual('authorValue');
    });
    it('persists data between entities', () => {
      const authorDatastore = (author.constructor as any).datastore as Datastore;
      const bookDatastore = (book.constructor as any).datastore as Datastore;
      authorDatastore.write('sharedKey', 'sharedValue');
      expect.assertions(1);
      expect(bookDatastore.read('sharedKey')).resolves.toEqual('sharedValue');
    });
  });
});
