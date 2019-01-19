import { Datastore } from '..';
import { Author } from '../__tests__/shared/entities/Author.test';

describe('Column', () => {
  it('defaults to null', async () => {
    const author = new Author();
    expect.assertions(1);
    expect(await author.firstName).toBeNull();
  });
  describe('persists a value', () => {
    const author = new Author();
    author.firstName = 'John';
    const datastore = (author.constructor as any).datastore as Datastore;

    it('into the datastore', async () => {
      expect.assertions(1);
      expect(await datastore.read(datastore.generateKey(author, 'firstName'))).toEqual('John');
    });
    it('and retrieves the cached value', async () => {
      datastore.delete(datastore.generateKey(author, 'firstName'));
      expect.assertions(2);
      expect(await datastore.read(datastore.generateKey(author, 'firstName'))).toBeNull();
      expect(await author.firstName).toEqual('John');
      author.firstName = 'John';
    });
    it('and retrieves the datastore value', async () => {
      delete (author as any)._firstName;
      expect.assertions(2);
      expect((author as any)._firstName).toBeUndefined();
      expect(await author.firstName).toEqual('John');
      author.firstName = 'John';
    });
  });
});
