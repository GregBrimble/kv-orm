import { Column } from '../../..';
import { BaseEntity, Entity } from '../../../Entity';
import { OneToMany } from '../../../relationships/OneToMany';
import { OneToOne } from '../../../relationships/OneToOne';
import { memoryDatastore } from '../Datastore.test';
import { Agent } from './Agent.test';
import { Book } from './Book.test';

@Entity(memoryDatastore)
export class Author extends BaseEntity {
  public static generatePenName() {
    const firstNames = ['Ernest', 'William', 'Charles', 'Mark', 'Stephen', 'Virginia', 'James', 'Jane'];
    const lastNames = ['Hemingway', 'Shakespeare', 'Dickens', 'Twain', 'King', 'Woolf', 'Joyce', 'Austen'];

    function choose(arr: any[]) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const randomFirstName = choose(firstNames);
    const randomLastName = choose(lastNames);
    return `${randomFirstName} ${randomLastName}`;
  }

  @Column()
  public firstName!: string;

  @Column()
  public lastName!: string;

  @Column()
  public isPerson: boolean = true;

  @OneToMany(Book)
  public books: Book[] = [];

  @OneToOne(Agent)
  public agent: Agent | null = null;

  public temporarilyFlaggedInMemory: boolean = false;
}

describe('Author', () => {
  it('can be initialized', () => {
    expect(new Author()).toBeInstanceOf(Author);
  });
});
