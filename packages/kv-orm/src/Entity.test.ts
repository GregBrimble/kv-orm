import { memoryDatastore } from './__tests__/shared/Datastore.test';
import { Author } from './__tests__/shared/entities/Author.test';
import { Datastore } from './datastore/Datastore';
import { BaseEntity, BaseEntityPrivate, Entity } from './Entity';
import { uuid } from './utils';

describe('Entity', () => {
  let author: Author;

  beforeEach(() => {
    author = new Author();
  });

  it("retains a Class's properties", async () => {
    expect.assertions(1);
    expect(await author.isPerson).toBeTruthy();
  });
  it("retains a Class's static members", () => {
    expect(Author.generatePenName()).toBeTruthy();
  });
  it('injects the datastore to the constructor', () => {
    expect(((author as unknown) as BaseEntityPrivate).__meta.datastore).toBeInstanceOf(Datastore);
  });
  describe('with default properties', () => {
    it('saves them at initialization', async () => {
      expect.assertions(2);
      expect(await author.isPerson).toBeTruthy();
      expect(
        await ((author as unknown) as BaseEntityPrivate).__meta.datastore.read(`Author:${author.uuid}:isPerson`)
      ).toBeTruthy();
    });
    it('restores them at loading', async () => {
      author.isPerson = false;

      const foundAuthor = await Author.get(author.uuid);

      expect.assertions(2);
      expect(
        await ((author as unknown) as BaseEntityPrivate).__meta.datastore.read(`Author:${author.uuid}:isPerson`)
      ).toBeFalsy();
      expect(await foundAuthor.isPerson).toBeFalsy();
    });
  });
  describe('instanceof decorated classes', () => {
    it('returns true for direct instances of a class', () => {
      @Entity(memoryDatastore)
      class A {}

      const x = new A();

      expect(x instanceof A).toBeTruthy();
    });
    it('returns true for immediate parent classes of an instance', () => {
      @Entity(memoryDatastore)
      class A {}

      @Entity(memoryDatastore)
      class B extends A {}

      const x = new B();

      expect(x instanceof A).toBeTruthy();
      expect(x instanceof B).toBeTruthy();
    });
    it('returns true for grand-parent classes of an instance', () => {
      class A {}

      @Entity(memoryDatastore)
      class B extends A {}

      @Entity(memoryDatastore)
      class C extends B {}

      const x = new C();

      expect(x instanceof A).toBeTruthy();
      expect(x instanceof B).toBeTruthy();
      expect(x instanceof C).toBeTruthy();
    });
    it('returns false for unrelated classes', () => {
      class A {}

      @Entity(memoryDatastore)
      class B extends A {}

      @Entity(memoryDatastore)
      class C {}

      const x = new C();

      expect(x instanceof A).toBeFalsy();
      expect(x instanceof B).toBeFalsy();
      expect(x instanceof C).toBeTruthy();
    });
  });
  it('supports constructor arguments on the Entity', () => {
    @Entity(memoryDatastore)
    class A extends BaseEntity {
      public myProp: string;

      public constructor(myProp: string) {
        super();
        this.myProp = myProp;
      }
    }

    const x = new A('propValue');

    expect(x.myProp).toEqual('propValue');
  });
});

describe('BaseEntity', () => {
  describe('injects the static functions', () => {
    it('and get returns and instance of the Entity, with a matching UUID', async () => {
      const someUUID = uuid();
      const foundAuthor = await Author.get(someUUID);

      expect.assertions(2);
      expect(foundAuthor).toBeInstanceOf(Author);
      expect(foundAuthor.uuid).toEqual(someUUID);
    });
  });
});
