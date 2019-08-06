import { MemoryDatastore } from '../../kv-orm-memory';
import { SearchStrategy } from '../dist';
import { Datastore } from './datastore/Datastore';
import { arrayBufferToHex, hexToArrayBuffer, paginateDatastoreSearch } from './utils';

const uuidWithDashes = '10ba038e-48da-487b-96e8-8d3b99b6d18a';
const uuidWithoutDashes = '10ba038e48da487b96e88d3b99b6d18a';
const arrayBufferValue = new Uint8Array([16, -70, 3, -114, 72, -38, 72, 123, -106, -24, -115, 59, -103, -74, -47, -118])
  .buffer;

describe('hexToArrayBuffer', () => {
  it('converts a hex string to an ArrayBuffer', () => {
    // https://github.com/firefox-devtools/profiler/issues/1035#issuecomment-391721358
    const convertedValue = hexToArrayBuffer(uuidWithDashes);
    expect(convertedValue.byteLength).toBe(16);
    expect(new Uint8Array(convertedValue)).toEqual(new Uint8Array(arrayBufferValue));
  });

  it('copes with dashes', () => {
    expect(new Uint8Array(hexToArrayBuffer(uuidWithoutDashes))).toEqual(
      new Uint8Array(hexToArrayBuffer(uuidWithDashes))
    );
  });
});

describe('arrayBufferToHex', () => {
  it('converts an ArrayBuffer to a hex string', () => {
    expect(arrayBufferToHex(arrayBufferValue)).toEqual(uuidWithoutDashes);
  });
});

describe('paginateDatastoreSearch', () => {
  it('gets all values across multiple pages', async () => {
    const datastore = new MemoryDatastore();

    for (const i in [...Array(3001).keys()]) {
      datastore.write(`somePrefix:${i.toString()}`, i);
    }

    expect.assertions(4);

    const onePageResults = await datastore.search({ term: 'somePrefix', strategy: SearchStrategy.prefix });
    expect(onePageResults.hasNextPage).toBeTruthy();
    expect(onePageResults.keys.length).toBe(1000);

    const allResults = await paginateDatastoreSearch((datastore as unknown) as Datastore, {
      term: 'somePrefix',
      strategy: SearchStrategy.prefix
    });
    expect(allResults.hasNextPage).toBeFalsy();
    expect(allResults.keys.length).toBe(3001);
  });
});
