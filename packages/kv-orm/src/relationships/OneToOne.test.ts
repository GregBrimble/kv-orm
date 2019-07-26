import { Datastore } from '..';
import { Agent } from '../__tests__/shared/entities/Agent.test';
import { Author } from '../__tests__/shared/entities/Author.test';

describe('OneToOne', () => {
  it('defaults to null', async () => {
    const author = new Author();
    expect.assertions(1);
    expect(await author.agent).toBeNull();
  });
  describe('persists a relationship', () => {
    const author = new Author();
    const agent = new Agent();
    author.agent = agent;
    const datastore = (author.constructor as any).datastore as Datastore;

    it('as a UUID in the datastore', async () => {
      expect.assertions(1);
      expect(await datastore.read(datastore.generateKey(author, 'agent'))).toEqual(agent.uuid);
    });
    it('and hydrates on get', async () => {
      const foundAgent = await author.agent;
      expect(foundAgent).toBeInstanceOf(Agent);
      expect(foundAgent.uuid).toEqual(agent.uuid);
    });
  });
});
