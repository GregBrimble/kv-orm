import { Author } from './__tests__/shared/entities/Author.test';
import { Datastore } from './datastore/Datastore';
import { uuid } from './utils';

const author = new Author();

describe('Entity', () => {
  it('retains a Class\'s properties', () => {
    expect(author.isPerson).toBeTruthy();
  });
  it('retains a Class\'s static members', () => {
    expect(Author.generatePenName()).toBeTruthy();
  });
  it('injects the datastore to the constructor', () => {
    expect((author.constructor as any).datastore).toBeInstanceOf(Datastore);
  });
  describe('with default properties', () => {
    it('saves them at initialization', async () => {
      expect(author.isPerson).toBeTruthy();
      expect.assertions(2);
      expect(((author.constructor as any).datastore as Datastore).read(`Author:${author.uuid}:isPerson`)).resolves.toBeTruthy();
    });
    it('restores them at loading', async () => {
      author.isPerson = false;

      const foundAuthor = (await Author.get(author.uuid)) as Author;
      expect.assertions(1);
      expect(foundAuthor.isPerson).resolves.toBeFalsy();
    });
  });
});

describe('BaseEntity', () => {
  describe('injects the static functions', () => {
    it('and get returns and instance of the Entity, with a matching UUID', async () => {
      expect.assertions(2);
      const someUUID = uuid();
      const foundAuthor = (await Author.get(someUUID)) as Author;
      expect(foundAuthor).toBeInstanceOf(Author);
      expect(foundAuthor.uuid).toEqual(someUUID);
    });
  });
});
