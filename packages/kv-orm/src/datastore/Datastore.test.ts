import { memoryDatastore } from '../__tests__/shared/Datastore.test';
import { Author } from '../__tests__/shared/entities/Author.test';
import { Book } from '../__tests__/shared/entities/Book.test';
import { Datastore } from './Datastore';

describe('Datastore', () => {
  const author = new Author();
  const book = new Book();
  describe('can be implemented', () => {
    it('and then be written to and read from', async () => {
      memoryDatastore.write('key', 'value');
      expect.assertions(1);
      expect(await memoryDatastore.read('key')).toEqual('value');
    });
    it("and doesn't error when reading nonexistent keys", async () => {
      expect.assertions(1);
      expect(await memoryDatastore.read('non-existent key')).toBeNull();
    });
    it('and can delete stored keys', async () => {
      memoryDatastore.write('temporaryKey', 'temporaryValue');
      expect.assertions(2);
      expect(await memoryDatastore.read('temporaryKey')).toEqual('temporaryValue');
      memoryDatastore.delete('temporaryKey');
      expect(await memoryDatastore.read('temporaryKey')).toBeNull();
    });
    describe('through entities', () => {
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
});
