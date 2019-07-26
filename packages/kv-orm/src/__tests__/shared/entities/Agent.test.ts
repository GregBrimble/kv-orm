import { BaseEntity, Column } from '../../..';
import { Entity } from '../../../Entity';
import { memoryDatastore } from '../Datastore.test';

@Entity(memoryDatastore)
export class Agent extends BaseEntity {
  @Column()
  public name!: string;
}

describe('Agent', () => {
  it('can be initialized', () => {
    expect(new Agent()).toBeInstanceOf(Agent);
  });
});
