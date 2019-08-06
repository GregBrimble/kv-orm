import { Datastore } from '..';
import { Agent } from '../__tests__/shared/entities/Agent.test';
import { Author } from '../__tests__/shared/entities/Author.test';
import { Book } from '../__tests__/shared/entities/Book.test';
import { BaseEntityPrivate } from '../Entity';

describe('OneToOne', () => {
  let charlesDickens: Author;
  let famousAgent: Agent;
  let datastore: Datastore;

  beforeEach(() => {
    charlesDickens = new Author();
    charlesDickens.firstName = 'Charles';
    charlesDickens.lastName = 'Dickens';

    famousAgent = new Agent();
    famousAgent.firstName = 'Famous';
    famousAgent.lastName = 'Agent';

    charlesDickens.agent = famousAgent;

    datastore = ((charlesDickens as unknown) as BaseEntityPrivate).__meta.datastore;
  });
  it('can be set on an Entity', async () => {
    expect.assertions(2);
    expect(await datastore.read(datastore.generateKey(charlesDickens, 'agent', famousAgent))).toEqual(
      datastore.generateKey(famousAgent)
    );
    expect(await charlesDickens.agent).toBe(famousAgent);
  });
  it('can be retrieved from the cache', async () => {
    datastore.delete(datastore.generateKey(charlesDickens, 'agent', famousAgent));
    expect.assertions(1);
    expect(await charlesDickens.agent).toBe(famousAgent);
  });
  it('can recreate the relational instance from the datastore', async () => {
    const properties = ((charlesDickens as unknown) as BaseEntityPrivate).__meta.properties;
    delete properties.agent;
    expect.assertions(1);
    expect(await charlesDickens.agent).toEqual(famousAgent);
  });
  it('can be deleted', async () => {
    expect.assertions(3);
    charlesDickens.agent = null;
    expect(await charlesDickens.firstName).toEqual('Charles'); // TODO: Fix race condition with something
    expect(await charlesDickens.agent).toBeNull();
    expect(await datastore.read(datastore.generateKey(charlesDickens, 'agent', famousAgent))).toBeNull();
  });
  it('can affect other instances', async () => {
    expect.assertions(2);
    const agent = (await (await Author.get(charlesDickens.uuid)).agent) as Agent;
    agent.firstName = 'Jane';
    // @ts-ignore
    expect(await agent.firstName).toEqual('Jane');
    expect(await datastore.read(datastore.generateKey(agent, 'firstName'))).toEqual('Jane');
  });
});
