import { Datastore, SearchStrategy } from "kv-orm";

export interface CloudflareWorkersKVNamespace {
  get(key: string): Promise<any>;

  put(key: string, value: any): Promise<void>;

  delete(key: string): Promise<void>;

  list(options: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    keys: { name: string; expiration?: number }[];
    list_complete: boolean;
    cursor: string;
  }>;
}

export class CloudflareWorkersKVDatastore extends Datastore {
  protected searchStrategies = [SearchStrategy.prefix];

  private namespace: CloudflareWorkersKVNamespace;

  public constructor(
    namespace: CloudflareWorkersKVNamespace,
    keySeparator: string = ":"
  ) {
    super(keySeparator);
    this.namespace = namespace;
  }

  public read(key: string): Promise<any> {
    return this.namespace.get(key);
  }

  public write(key: string, value: any): Promise<void> {
    return this.namespace.put(key, value);
  }

  public delete(key: string): Promise<void> {
    return this.namespace.delete(key);
  }

  public async search({
    term,
    strategy = SearchStrategy.prefix,
    first = Infinity,
    after = undefined
  }: {
    term: string;
    strategy?: SearchStrategy;
    first?: number;
    after?: string;
  }): Promise<{
    keys: string[];
    hasNextPage: boolean;
    cursor: string;
  }> {
    if (!this.searchStrategies.includes(strategy)) {
      throw new Error("Unimplemented search strategy.");
    }

    let response = await this.namespace.list({
      prefix: term,
      limit: first,
      cursor: after
    });

    return {
      keys: response.keys.map(key => key.name),
      hasNextPage: !response.list_complete,
      cursor: response.cursor
    };
  }
}
