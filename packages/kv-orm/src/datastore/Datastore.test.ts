import { memoryDatastore } from '../__tests__/shared/Datastore.test';
import { Author } from '../__tests__/shared/entities/Author.test';
import { Book } from '../__tests__/shared/entities/Book.test';
import { Datastore } from './Datastore';

describe('Datastore', () => {
  const author = new Author();
  const book = new Book();
  describe('can be implemented', () => {
    it('and then be written to and read from', () => {
      memoryDatastore.write('key', 'value');
      expect.assertions(1);
      expect(memoryDatastore.read('key')).resolves.toEqual('value');
    });
    it("and doesn't error when reading nonexistent keys", () => {
      expect.assertions(1);
      expect(memoryDatastore.read('non-existent key')).resolves.toBeNull();
    });
    it('and can delete stored keys', () => {
      memoryDatastore.write('temporaryKey', 'temporaryValue');
      expect.assertions(2);
      expect(memoryDatastore.read('temporaryKey')).resolves.toEqual('temporaryValue');
      memoryDatastore.delete('temporaryKey');
      expect(memoryDatastore.read('temporaryKey')).resolves.toBeNull();
    });
    describe('through entities', () => {
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
});
