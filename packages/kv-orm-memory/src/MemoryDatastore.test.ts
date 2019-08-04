import { MemoryDatastore } from './MemoryDatastore';

import { testDatastore } from '../../Datastores.test';

describe('MemoryDatastore', () => {
  const memoryDatastore = new MemoryDatastore(':');

  testDatastore('kv-orm-memory', { instance: memoryDatastore, class: MemoryDatastore });
});
