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
  it('can be written to and read from', () => {
    cfWorkersKVDatastore.write('key', 'value');
    expect.assertions(1);
    expect(cfWorkersKVDatastore.read('key')).resolves.toEqual('value');
  });
  it("doesn't error when reading nonexistent keys", () => {
    expect.assertions(1);
    expect(cfWorkersKVDatastore.read('non-existent key')).resolves.toBeNull();
  });
  it('can delete stored keys', () => {
    cfWorkersKVDatastore.write('temporaryKey', 'temporaryValue');
    expect.assertions(2);
    expect(cfWorkersKVDatastore.read('temporaryKey')).resolves.toEqual('temporaryValue');
    cfWorkersKVDatastore.delete('temporaryKey');
    expect(cfWorkersKVDatastore.read('temporaryKey')).resolves.toBeNull();
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

    it('can be accessed', () => {
      const datastore = (author.constructor as any).datastore as Datastore;
      datastore.write('authorKey', 'authorValue');
      expect.assertions(1);
      expect(datastore.read('authorKey')).resolves.toEqual('authorValue');
    });
    it('persists data between entities', () => {
      const authorDatastore = (author.constructor as any).datastore as Datastore;
      const bookDatastore = (book.constructor as any).datastore as Datastore;
      authorDatastore.write('sharedKey', 'sharedValue');
      expect.assertions(1);
      expect(bookDatastore.read('sharedKey')).resolves.toEqual('sharedValue');
    });
  });
});
