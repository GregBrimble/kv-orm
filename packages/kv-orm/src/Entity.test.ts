import { Author } from './__tests__/shared/entities/Author.test';
import { Datastore } from './datastore/Datastore';
import { uuid } from './utils';

const author = new Author();

describe('Entity', () => {
  it('retains a Class\'s properties', () => {
    return expect(author.isPerson).resolves.toBeTruthy();
  });
  it('retains a Class\'s static members', () => {
    expect(Author.generatePenName()).toBeTruthy();
  });
  it('injects the datastore to the constructor', () => {
    expect((author.constructor as any).datastore).toBeInstanceOf(Datastore);
  });
  describe('with default properties', () => {
    it('saves them at initialization', async () => {
      expect.assertions(2);
      expect(await author.isPerson).toBeTruthy();
      expect(await ((author.constructor as any).datastore as Datastore).read(`Author:${author.uuid}:isPerson`)).toBeTruthy();
    });
    it('restores them at loading', async () => {
      author.isPerson = false;

      const foundAuthor = (await Author.get(author.uuid)) as Author;

      expect.assertions(2);
      expect(await ((author.constructor as any).datastore as Datastore).read(`Author:${author.uuid}:isPerson`)).toBeFalsy();
      expect(await foundAuthor.isPerson).toBeFalsy();
    });
  });
});

describe('BaseEntity', () => {
  describe('injects the static functions', () => {
    it('and get returns and instance of the Entity, with a matching UUID', async () => {
      const someUUID = uuid();
      const foundAuthor = (await Author.get(someUUID)) as Author;

      expect.assertions(2);
      expect(foundAuthor).toBeInstanceOf(Author);
      expect(foundAuthor.uuid).toEqual(someUUID);
    });
  });
});
