import { Author } from './__tests__/shared/entities/Author.test';
import { Datastore } from './datastore/Datastore';
import { uuid } from './utils';

const author = new Author();

describe('Entity', () => {
  it("retains a Class's properties", () => {
    expect(author.isPerson).toBeTruthy();
  });
  it("retains a Class's static members", () => {
    expect(Author.generatePenName()).toBeTruthy();
  });
  it('injects the datastore to the constructor', () => {
    expect((author.constructor as any).datastore).toBeInstanceOf(Datastore);
  });
});

describe('BaseEntity', () => {
  describe('injects the static functions', () => {
    it('and find returns and instance of the Entity, with a matching UUID', async () => {
      expect.assertions(2);
      const someUUID = uuid();
      const foundAuthor = (await Author.find(someUUID)) as Author;
      expect(foundAuthor).toBeInstanceOf(Author);
      expect(foundAuthor.uuid).toEqual(someUUID);
    });
  });
});
