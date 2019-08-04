import { testDatastore } from "../../Datastores.test";
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

  testDatastore("kv-orm-cf-workers", {
    instance: cfWorkersKVDatastore,
    class: CloudflareWorkersKVDatastore
  });
});
