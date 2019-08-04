import { Datastore } from '../..';
import { MemoryDatastore } from '../../../../kv-orm-memory';

export const memoryDatastore = (new MemoryDatastore(':') as unknown) as Datastore;

it('can do math', () => {
  expect(1 + 2).toBe(3);
});
