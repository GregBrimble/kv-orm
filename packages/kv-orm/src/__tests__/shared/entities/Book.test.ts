import { BaseEntity, Column } from '../../..';
import { Entity } from '../../../Entity';
import { memoryDatastore } from '../Datastore.test';

@Entity(memoryDatastore)
export class Book extends BaseEntity {
  @Column()
  public title!: string;
}

describe('Book', () => {
  it('can be initialized', () => {
    expect(new Book()).toBeInstanceOf(Book);
  });
});
