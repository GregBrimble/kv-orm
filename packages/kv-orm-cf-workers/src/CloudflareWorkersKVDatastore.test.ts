import { BaseEntity, Datastore, Entity } from 'kv-orm';
import { CloudflareWorkersKVDatastore, ICloudflareWorkersKVNamespace } from './CloudflareWorkersKVDatastore';

class Namespace implements ICloudflareWorkersKVNamespace {
  private data: { [key: string]: any } = {};

  public delete(key: string): void {
    delete this.data[key];
  }

  public get(key: string): Promise<any> {
    return Promise.resolve(this.data[key] || null);
  }

  public put(key: string, value: any): void {
    this.data[key] = value;
  }
}

const namespace = new Namespace();

describe('CloudflareWorkersKVDatastore', () => {
  const cfWorkersKVDatastore = new CloudflareWorkersKVDatastore(namespace, ':');

  it('can be initialized', () => {
    expect(cfWorkersKVDatastore).toBeInstanceOf(CloudflareWorkersKVDatastore);
  });
  it('can be written to and read from', async () => {
    cfWorkersKVDatastore.write('key', 'value');
    expect.assertions(1);
    expect(await cfWorkersKVDatastore.read('key')).toEqual('value');
  });
  it("doesn't error when reading nonexistent keys", async () => {
    expect.assertions(1);
    expect(await cfWorkersKVDatastore.read('non-existent key')).toBeNull();
  });
  it('can delete stored keys', async () => {
    cfWorkersKVDatastore.write('temporaryKey', 'temporaryValue');
    expect.assertions(2);
    expect(await cfWorkersKVDatastore.read('temporaryKey')).toEqual('temporaryValue');
    cfWorkersKVDatastore.delete('temporaryKey');
    expect(await cfWorkersKVDatastore.read('temporaryKey')).toBeNull();
  });
  describe('using entities', () => {

    @Entity(cfWorkersKVDatastore)
    class Author extends BaseEntity {
    }

    @Entity(cfWorkersKVDatastore)
    class Book extends BaseEntity {
    }

    const author = new Author();
    const book = new Book();

    it('can be accessed', async () => {
      const datastore = (author.constructor as any).datastore as Datastore;
      datastore.write('authorKey', 'authorValue');
      expect.assertions(1);
      expect(await datastore.read('authorKey')).toEqual('authorValue');
    });
    it('persists data between entities', async () => {
      const authorDatastore = (author.constructor as any).datastore as Datastore;
      const bookDatastore = (book.constructor as any).datastore as Datastore;
      authorDatastore.write('sharedKey', 'sharedValue');
      expect.assertions(1);
      expect(await bookDatastore.read('sharedKey')).toEqual('sharedValue');
    });
  });
});
