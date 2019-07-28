import { BaseEntityPrivate, Datastore } from '..';
import { Author } from '../__tests__/shared/entities/Author.test';

describe('Column', () => {
  let author: Author;

  beforeEach(() => {
    author = new Author();
  });

  it('defaults to null', async () => {
    expect.assertions(1);
    expect(await author.firstName).toBeNull();
  });
  describe('persists a value', () => {
    beforeEach(() => {
      author.firstName = 'John';
    });

    it('into the datastore', async () => {
      const datastore = ((author as unknown) as BaseEntityPrivate).__meta.datastore;
      expect.assertions(1);
      expect(await datastore.read(datastore.generateKey(author, 'firstName'))).toEqual('John');
    });
    it('and retrieves the cached value', async () => {
      const datastore = ((author as unknown) as BaseEntityPrivate).__meta.datastore;
      datastore.delete(datastore.generateKey(author, 'firstName'));
      expect.assertions(2);
      expect(await datastore.read(datastore.generateKey(author, 'firstName'))).toBeNull();
      expect(await author.firstName).toEqual('John');
    });
    it('and retrieves the datastore value', async () => {
      const properties = ((author as unknown) as BaseEntityPrivate).__meta.properties;
      delete properties.firstName;
      expect.assertions(2);
      expect(properties.firstName).toBeUndefined();
      expect(await author.firstName).toEqual('John');
    });
  });
});
