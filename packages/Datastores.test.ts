import { BaseEntity, SearchStrategy, Entity, Datastore } from "./kv-orm";

export function testDatastore(label: string, options: { instance: Datastore, class: any }) {
  const datastore = options.instance;

  describe(label, () => {
    beforeEach(() => {
      datastore.write('key', 'value');
    });

    it('can be initialized', () => {
      expect(datastore).toBeInstanceOf(options.class);
    });
    it('can be written to and read from', async () => {
      expect.assertions(1);
      expect(await datastore.read('key')).toEqual('value');
    });
    it("doesn't error when reading nonexistent keys", async () => {
      expect.assertions(1);
      expect(await datastore.read('non-existent key')).toBeNull();
    });
    it('and keys can be searched', async () => {
      expect.assertions(1);
      expect((await datastore.search({ term: 'ke' })).keys).toEqual(['key']);
    });
    describe('search', () => {
      it('can be searched', async () => {
        datastore.write('zzzTestKey1', 'zzzTestValue1');
        datastore.write('zzzTestKey2', 'zzzTestValue2');
        datastore.write('zzzTestKey3', 'zzzTestValue3');

        expect.assertions(8);
        const findOne = await datastore.search({ term: 'zzzTest', strategy: SearchStrategy.prefix, first: 1 });
        expect(findOne.keys.length).toBe(1);
        expect(['zzzTestKey1', 'zzzTestKey2', 'zzzTestKey3']).toContain(findOne.keys[0]);
        expect(findOne.cursor).toBe('0');
        expect(findOne.hasNextPage).toBeTruthy();

        const findRest = await datastore.search({ term: 'zzzTest', strategy: SearchStrategy.prefix, after: '0' });
        expect(findRest.keys.length).toBe(2);
        expect(findRest.keys).not.toContain(findOne.keys[0]);
        expect(findRest.cursor).toBe('2');
        expect(findRest.hasNextPage).toBeFalsy();
      });
    });
    it('can delete stored keys', async () => {
      datastore.write('temporaryKey', 'temporaryValue');
      expect.assertions(2);
      expect(await datastore.read('temporaryKey')).toEqual('temporaryValue');
      datastore.delete('temporaryKey');
      expect(await datastore.read('temporaryKey')).toBeNull();
    });
    describe('using entities', () => {
      @Entity(datastore)
      class Author extends BaseEntity {}

      @Entity(datastore)
      class Book extends BaseEntity {}

      let author: Author;
      let book: Book;

      beforeEach(() => {
        author = new Author();
        book = new Book();
      });

      it('can be accessed', async () => {
        const authorDatastore = (author as any).__meta.datastore;
        authorDatastore.write('authorKey', 'authorValue');
        expect.assertions(1);
        expect(await authorDatastore.read('authorKey')).toEqual('authorValue');
      });
      it('persists data between entities', async () => {
        const authorDatastore = (author as any).__meta.datastore;
        const bookDatastore = (book as any).__meta.datastore;
        authorDatastore.write('sharedKey', 'sharedValue');
        expect.assertions(1);
        expect(await bookDatastore.read('sharedKey')).toEqual('sharedValue');
      });
    });
  });
}
