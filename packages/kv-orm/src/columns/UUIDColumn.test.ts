import { Author } from '../__tests__/shared/entities/Author.test';
import { uuid } from '../utils';

describe('UUIDColumn', () => {
  const author = new Author();

  it('generates a new non-colliding UUID by default', () => {
    expect(author.uuid.length).toEqual(36);
    expect(author.uuid).not.toEqual(new Author().uuid);
  });
  it('persists the same UUID', () => {
    expect(author.uuid).toEqual(author.uuid);
  });
  it('can hold a custom UUID', () => {
    const newUUID = uuid();
    author.uuid = newUUID;
    expect(author.uuid).toEqual(newUUID);
  });
});
