import { Author } from './shared/entities/Author.test';

describe('the library', () => {
  describe('with authors', () => {
    const ernestHemingway = new Author();
    ernestHemingway.firstName = 'Ernest';
    ernestHemingway.lastName = 'Hemingway';

    const williamShakespeare = new Author();
    williamShakespeare.uuid = '10ba038e-48da-487b-96e8-8d3b99b6d18a';
    williamShakespeare.firstName = 'William';
    williamShakespeare.lastName = 'Shakespeare';

    const fictionalAuthor = new Author();
    const fictionalNames = Author.generatePenName().split(' ');
    fictionalAuthor.firstName = fictionalNames[0];
    fictionalAuthor.lastName = fictionalNames[1];
    fictionalAuthor.isPerson = false;
    fictionalAuthor.temporarilyFlaggedInMemory = true;

    it('can find those authors by auto-generated UUID', async () => {
      const foundAuthor = (await Author.get(ernestHemingway.uuid)) as Author;

      expect.assertions(3);
      expect(foundAuthor.uuid).toEqual(ernestHemingway.uuid);
      expect(await foundAuthor.firstName).toEqual('Ernest');
      expect(await foundAuthor.lastName).toEqual('Hemingway');
    });

    it('can find those authors by manually specified UUID', async () => {
      const foundAuthor = (await Author.get(williamShakespeare.uuid)) as Author;

      expect.assertions(3);
      expect(foundAuthor.uuid).toEqual('10ba038e-48da-487b-96e8-8d3b99b6d18a');
      expect(await foundAuthor.firstName).toEqual('William');
      expect(await foundAuthor.lastName).toEqual('Shakespeare');
    });

    it('persists Column values as expected in the datastore', async () => {
      const foundAuthor = (await Author.get(fictionalAuthor.uuid)) as Author;

      expect.assertions(5);
      expect(foundAuthor.uuid).toEqual(fictionalAuthor.uuid);
      expect(await foundAuthor.firstName).toBeTruthy();
      expect(await foundAuthor.lastName).toBeTruthy();
      expect(await foundAuthor.isPerson).toBeFalsy();
      expect(foundAuthor.temporarilyFlaggedInMemory).toBeFalsy();
    });
  });
});
