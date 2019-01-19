import { memoryDatastore } from './__tests__/shared/Datastore.test';
import { Entity } from './Entity';
import { isRelatedInstanceOf } from './utils';

describe('isRelatedInstanceOf', () => {
  describe('given a related class', () => {
    it('returns true for direct instances of a class', () => {
      class A {}

      const x = new A();

      expect(isRelatedInstanceOf(x, A)).toBeTruthy();
    });
    it('returns true for immediate parent classes of an instance', () => {
      class A {}

      class B extends A {}

      const x = new B();

      expect(isRelatedInstanceOf(x, A)).toBeTruthy();
      expect(isRelatedInstanceOf(x, B)).toBeTruthy();
    });
    it('returns true for grand-parent classes of an instance', () => {
      class A {}

      class B extends A {}

      class C extends B {}

      const x = new C();

      expect(isRelatedInstanceOf(x, A)).toBeTruthy();
      expect(isRelatedInstanceOf(x, B)).toBeTruthy();
      expect(isRelatedInstanceOf(x, C)).toBeTruthy();
    });
  });
  describe('given an unrelated class', () => {
    it('returns false', () => {
      class A {}
      class B {}

      const x = new A();

      expect(isRelatedInstanceOf(x, B)).toBeFalsy();
    });
  });
  describe('works for even Entity decorated classes', () => {
    it('returns true for direct instances of a class', () => {
      @Entity(memoryDatastore)
      class A {}

      const x = new A();

      expect(isRelatedInstanceOf(x, A)).toBeTruthy();
    });
    it('returns true for immediate parent classes of an instance', () => {
      @Entity(memoryDatastore)
      class A {}

      @Entity(memoryDatastore)
      class B extends A {}

      const x = new B();

      expect(isRelatedInstanceOf(x, A)).toBeTruthy();
      expect(isRelatedInstanceOf(x, B)).toBeTruthy();
    });
    it('returns true for grand-parent classes of an instance', () => {
      class A {}

      @Entity(memoryDatastore)
      class B extends A {}

      @Entity(memoryDatastore)
      class C extends B {}

      const x = new C();

      expect(isRelatedInstanceOf(x, A)).toBeTruthy();
      expect(isRelatedInstanceOf(x, B)).toBeTruthy();
      expect(isRelatedInstanceOf(x, C)).toBeTruthy();
    });
  });
});
