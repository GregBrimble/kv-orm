import { BaseEntity, Datastore, Entity, SearchStrategy } from '../..';

export class MemoryDatastore extends Datastore {
  protected searchStrategies = [SearchStrategy.prefix];

  private data: { [key: string]: any } = {};

  public constructor(keySeparator: string = ':') {
    super(keySeparator);
  }

  public read(key: string): Promise<any> {
    return Promise.resolve(this.data[key] || null);
  }

  public write(key: string, value: any): void {
    this.data[key] = value;
  }

  public delete(key: string): void {
    delete this.data[key];
  }

  public search({
    term,
    strategy = SearchStrategy.prefix,
    first = Infinity,
    after = undefined
  }: {
    term: string;
    strategy?: SearchStrategy;
    first?: number;
    after?: string;
  }): Promise<{
    keys: string[];
    hasNextPage: boolean;
    cursor: string;
  }> {
    if (strategy !== SearchStrategy.prefix) {
      throw new Error('prefix is the only implemented search strategy.');
    }

    let keys = Object.keys(this.data).filter(key => key.startsWith(term));

    if (after === undefined) {
      after = '-1';
    }

    keys = keys.slice(+after + 1);

    const hasNextPage = keys.length > first;

    if (first !== Infinity) {
      keys = keys.slice(0, first);
    }

    const cursor = +after + (hasNextPage ? first : keys.length);

    return Promise.resolve({ keys, hasNextPage, cursor: cursor.toString() });
  }
}

export const memoryDatastore = new MemoryDatastore(':');

describe('MemoryDatastore', () => {
  it('can be initialized', () => {
    expect(memoryDatastore).toBeInstanceOf(MemoryDatastore);
  });
  it('successfully generates keys for an instance of BaseEntity', () => {
    @Entity(memoryDatastore)
    class Contact extends BaseEntity {
      /* The class property isn't actually required to test the key generator, as it only accepts a string */
      // @Column()
      // public firstName!: string;
    }

    const contact = new Contact();
    expect(memoryDatastore.generateKey(contact, 'firstName')).toEqual(`Contact:${contact.uuid}:firstName`);
  });
});
