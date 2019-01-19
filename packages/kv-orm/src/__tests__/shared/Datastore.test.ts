import { BaseEntity, Datastore, Entity } from '../..';

export class MemoryDatastore extends Datastore {
  private data: { [key: string]: any } = {};

  constructor(keySeparator: string = ':') {
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
