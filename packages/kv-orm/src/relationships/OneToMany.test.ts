import { Datastore } from '..';
import { Author } from '../__tests__/shared/entities/Author.test';
import { Book } from '../__tests__/shared/entities/Book.test';
import { BaseEntityPrivate } from '../Entity';

describe('OneToMany', () => {
  let hermanMelville: Author;
  let mobyDick: Book;
  let hermanMelvillesBooks: Book[];
  let datastore: Datastore;

  beforeEach(() => {
    hermanMelville = new Author();
    hermanMelville.firstName = 'Herman';
    hermanMelville.lastName = 'Melville';

    mobyDick = new Book();
    mobyDick.title = 'Moby Dick';

    hermanMelvillesBooks = [mobyDick];
    hermanMelville.books = hermanMelvillesBooks;

    datastore = ((hermanMelville as unknown) as BaseEntityPrivate).__meta.datastore;
  });
  it('can be set on an Entity', async () => {
    expect.assertions(2);
    expect(await datastore.read(datastore.generateKey(hermanMelville, 'books', mobyDick))).toEqual(
      datastore.generateKey(mobyDick)
    );
    expect(await hermanMelville.books).toBe(hermanMelvillesBooks);
  });
  it('can be retrieved from the cache', async () => {
    datastore.delete(datastore.generateKey(hermanMelville, 'books', mobyDick));
    expect.assertions(1);
    expect(await hermanMelville.books).toBe(hermanMelvillesBooks);
  });
  it('can recreate the relational instance from the datastore', async () => {
    const properties = ((hermanMelville as unknown) as BaseEntityPrivate).__meta.properties;
    delete properties.books;
    expect.assertions(1);
    expect(await hermanMelville.books).toEqual(hermanMelvillesBooks);
  });
  it('can be deleted', async () => {
    expect.assertions(3);
    hermanMelville.books = [];
    expect(await hermanMelville.firstName).toEqual('Herman'); // TODO: Fix race condition with something
    expect(await hermanMelville.books).toEqual([]);
    expect(await datastore.read(datastore.generateKey(hermanMelville, 'books', mobyDick))).toBeNull();
  });
  it('can affect other instances', async () => {
    expect.assertions(2);
    const books = await (await Author.get(hermanMelville.uuid)).books;
    books[0].title = 'The Adventures of Sherlock Holmes';
    // @ts-ignore
    expect(await mobyDick.title).toEqual('The Adventures of Sherlock Holmes');
    expect(await datastore.read(datastore.generateKey(mobyDick, 'title'))).toEqual('The Adventures of Sherlock Holmes');
  });
});
