import { BaseEntity, Entity, SearchStrategy } from 'kv-orm';
import { MemoryDatastore } from './MemoryDatastore';

describe('MemoryDatastore', () => {
  const memoryDatastore = new MemoryDatastore(':');

  beforeEach(() => {
    memoryDatastore.write('key', 'value');
  });

  it('can be initialized', () => {
    expect(memoryDatastore).toBeInstanceOf(MemoryDatastore);
  });
  it('can be written to and read from', async () => {
    expect.assertions(1);
    expect(await memoryDatastore.read('key')).toEqual('value');
  });
  it("doesn't error when reading nonexistent keys", async () => {
    expect.assertions(1);
    expect(await memoryDatastore.read('non-existent key')).toBeNull();
  });
  it('and keys can be searched', async () => {
    expect.assertions(1);
    expect((await memoryDatastore.search({ term: 'ke' })).keys).toEqual(['key']);
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
    class Author extends BaseEntity {}

    @Entity(memoryDatastore)
    class Book extends BaseEntity {}

    let author: Author;
    let book: Book;

    beforeEach(() => {
      author = new Author();
      book = new Book();
    });

    it('can be accessed', async () => {
      const datastore = (author as any).__meta.datastore;
      datastore.write('authorKey', 'authorValue');
      expect.assertions(1);
      expect(await datastore.read('authorKey')).toEqual('authorValue');
    });
    it('persists data between entities', async () => {
      const authorDatastore = (author as any).__meta.datastore;
      const bookDatastore = (book as any).__meta.datastore;
      authorDatastore.write('sharedKey', 'sharedValue');
      expect.assertions(1);
      expect(await bookDatastore.read('sharedKey')).toEqual('sharedValue');
    });
  });
  describe('search', () => {
    it('can be searched', async () => {
      memoryDatastore.write('zzzTestKey1', 'zzzTestValue1');
      memoryDatastore.write('zzzTestKey2', 'zzzTestValue2');
      memoryDatastore.write('zzzTestKey3', 'zzzTestValue3');

      expect.assertions(8);
      const findOne = await memoryDatastore.search({ term: 'zzzTest', strategy: SearchStrategy.prefix, first: 1 });
      expect(findOne.keys.length).toBe(1);
      expect(['zzzTestKey1', 'zzzTestKey2', 'zzzTestKey3']).toContain(findOne.keys[0]);
      expect(findOne.cursor).toBe('0');
      expect(findOne.hasNextPage).toBeTruthy();

      const findRest = await memoryDatastore.search({ term: 'zzzTest', strategy: SearchStrategy.prefix, after: '0' });
      expect(findRest.keys.length).toBe(2);
      expect(findRest.keys).not.toContain(findOne.keys[0]);
      expect(findRest.cursor).toBe('2');
      expect(findRest.hasNextPage).toBeFalsy();
    });
  });
});
