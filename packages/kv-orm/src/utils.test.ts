import { memoryDatastore } from './__tests__/shared/Datastore.test';
import { Entity } from './Entity';
import { arrayBufferToHex, hexToArrayBuffer, isRelatedInstanceOf } from './utils';

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

const uuidWithDashes = '10ba038e-48da-487b-96e8-8d3b99b6d18a';
const uuidWithoutDashes = '10ba038e48da487b96e88d3b99b6d18a';
const arrayBufferValue = new Uint8Array([16, -70, 3, -114, 72, -38, 72, 123, -106, -24, -115, 59, -103, -74, -47, -118]).buffer;

describe('hexToArrayBuffer', () => {
  it('converts a hex string to an ArrayBuffer', () => {
    // https://github.com/firefox-devtools/profiler/issues/1035#issuecomment-391721358
    const convertedValue = hexToArrayBuffer(uuidWithDashes);
    expect(convertedValue.byteLength).toBe(16);
    expect(new Uint8Array(convertedValue)).toEqual(new Uint8Array(arrayBufferValue));
  });

  it('copes with dashes', () => {
    expect(new Uint8Array(hexToArrayBuffer(uuidWithoutDashes))).toEqual(new Uint8Array(hexToArrayBuffer(uuidWithDashes)));
  });
});

describe('arrayBufferToHex', () => {
  it('converts an ArrayBuffer to a hex string', () => {
    expect(arrayBufferToHex(arrayBufferValue)).toEqual(uuidWithoutDashes);
  });
});
