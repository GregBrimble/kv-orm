import { Column } from '../../..';
import { BaseEntity, Entity } from '../../../Entity';
import { memoryDatastore } from '../Datastore.test';

@Entity(memoryDatastore)
export class Agent extends BaseEntity {
  @Column()
  public firstName!: string;

  @Column()
  public lastName!: string;
}

describe('Agent', () => {
  it('can be initialized', () => {
    expect(new Agent()).toBeInstanceOf(Agent);
  });
});
