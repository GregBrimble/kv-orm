import { memoryDatastore } from '../__tests__/shared/Datastore.test';
import { Author } from '../__tests__/shared/entities/Author.test';
import { Book } from '../__tests__/shared/entities/Book.test';
import { BaseEntityPrivate } from '../Entity';

describe('Datastore', () => {
  const author = new Author();
  const book = new Book();

  it('generateKey generates keys for properties', () => {
    expect(author.uuid).toBeTruthy();
    expect(author.uuid.length > 0).toBeTruthy();
    expect(((author as unknown) as BaseEntityPrivate).__meta.key).toEqual('Author');
    expect((memoryDatastore as any).keySeparator).toEqual(':');
    expect(memoryDatastore.generateKey(author, 'firstName')).toEqual(`Author:${author.uuid}:firstName`);
  });

  it('generateKey generates keys for relations', () => {
    expect(author.uuid).toBeTruthy();
    expect(author.uuid.length > 0).toBeTruthy();
    expect(book.uuid).toBeTruthy();
    expect(book.uuid.length > 0).toBeTruthy();
    expect(((author as unknown) as BaseEntityPrivate).__meta.key).toEqual('Author');
    expect((memoryDatastore as any).keySeparator).toEqual(':');
    expect(memoryDatastore.generateKey(author, 'books', book)).toEqual(`Author:${author.uuid}:books:Book:${book.uuid}`);
  });
});
