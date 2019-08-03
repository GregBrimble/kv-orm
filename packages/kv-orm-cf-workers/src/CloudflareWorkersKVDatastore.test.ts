import { BaseEntity, SearchStrategy, Entity } from "kv-orm";
import {
  CloudflareWorkersKVDatastore,
  CloudflareWorkersKVNamespace
} from "./CloudflareWorkersKVDatastore";

class Namespace implements CloudflareWorkersKVNamespace {
  private data: { [key: string]: any } = {};

  public delete(key: string): void {
    delete this.data[key];
  }

  public get(key: string): Promise<any> {
    return Promise.resolve(this.data[key] || null);
  }

  public put(key: string, value: any): void {
    this.data[key] = value;
  }

  public list({
    prefix,
    limit = 1000,
    cursor = "-1"
  }: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    keys: { name: string; expiration?: number }[];
    list_complete: boolean;
    cursor: string;
  }> {
    limit = Math.min(1000, limit);
    let keys = Object.keys(this.data);

    if (prefix !== undefined) {
      keys = keys.filter(key => key.startsWith(prefix));
    }

    keys = keys.slice(+cursor + 1);

    const hasNextPage = keys.length > limit;

    keys = keys.slice(0, limit);

    const nextCursor = +cursor + (hasNextPage ? limit : keys.length);

    return Promise.resolve({
      keys: keys.map(key => ({ name: key })),
      list_complete: !hasNextPage, // eslint-disable-line
      cursor: nextCursor.toString()
    });
  }
}

const namespace = new Namespace();

describe("CloudflareWorkersKVDatastore", () => {
  const cfWorkersKVDatastore = new CloudflareWorkersKVDatastore(namespace, ":");

  it("can be initialized", () => {
    expect(cfWorkersKVDatastore).toBeInstanceOf(CloudflareWorkersKVDatastore);
  });
  it("can be written to and read from", async () => {
    cfWorkersKVDatastore.write("key", "value");
    expect.assertions(1);
    expect(await cfWorkersKVDatastore.read("key")).toEqual("value");
  });
  it("doesn't error when reading nonexistent keys", async () => {
    expect.assertions(1);
    expect(await cfWorkersKVDatastore.read("non-existent key")).toBeNull();
  });
  it("can delete stored keys", async () => {
    cfWorkersKVDatastore.write("temporaryKey", "temporaryValue");
    expect.assertions(2);
    expect(await cfWorkersKVDatastore.read("temporaryKey")).toEqual(
      "temporaryValue"
    );
    cfWorkersKVDatastore.delete("temporaryKey");
    expect(await cfWorkersKVDatastore.read("temporaryKey")).toBeNull();
  });
  describe("using entities", () => {
    @Entity(cfWorkersKVDatastore)
    class Author extends BaseEntity {}

    @Entity(cfWorkersKVDatastore)
    class Book extends BaseEntity {}

    const author = new Author();
    const book = new Book();

    it("can be accessed", async () => {
      const datastore = (author as any).__meta.datastore;
      datastore.write("authorKey", "authorValue");
      expect.assertions(1);
      expect(await datastore.read("authorKey")).toEqual("authorValue");
    });
    it("persists data between entities", async () => {
      const authorDatastore = (author as any).__meta.datastore;
      const bookDatastore = (book as any).__meta.datastore;
      bookDatastore.write("sharedKey", "sharedValue");
      expect.assertions(1);
      expect(await bookDatastore.read("sharedKey")).toEqual("sharedValue");
    });
  });
  describe("search", () => {
    it("can be searched", async () => {
      cfWorkersKVDatastore.write("zzzTestKey1", "zzzTestValue1");
      cfWorkersKVDatastore.write("zzzTestKey2", "zzzTestValue2");
      cfWorkersKVDatastore.write("zzzTestKey3", "zzzTestValue3");

      expect.assertions(8);
      const findOne = await cfWorkersKVDatastore.search({
        term: "zzzTest",
        strategy: SearchStrategy.prefix,
        first: 1
      });
      expect(findOne.keys.length).toBe(1);
      expect(["zzzTestKey1", "zzzTestKey2", "zzzTestKey3"]).toContain(
        findOne.keys[0]
      );
      expect(findOne.cursor).toBe("0");
      expect(findOne.hasNextPage).toBeTruthy();

      const findRest = await cfWorkersKVDatastore.search({
        term: "zzzTest",
        strategy: SearchStrategy.prefix,
        after: "0"
      });
      expect(findRest.keys.length).toBe(2);
      expect(findRest.keys).not.toContain(findOne.keys[0]);
      expect(findRest.cursor).toBe("2");
      expect(findRest.hasNextPage).toBeFalsy();
    });
  });
});
