import { BaseEntity, BaseEntityPrivate } from '../Entity';

export enum SearchStrategy {
  prefix
}

export abstract class Datastore {
  protected abstract searchStrategies: SearchStrategy[];

  private readonly keySeparator: string = ':';

  protected constructor(keySeparator: string) {
    this.keySeparator = keySeparator;
  }

  public abstract read(key: string): Promise<any>;

  public abstract write(key: string, value: any): void;

  public abstract delete(key: string): void;

  public abstract search({
    term,
    strategy,
    first,
    after
  }: {
    term: string;
    strategy?: SearchStrategy;
    first?: number;
    after?: string;
  }): Promise<{
    keys: string[];
    hasNextPage: boolean;
    cursor: string;
  }>;

  public generateKey(instance: BaseEntity, key: string): string {
    return [(instance as BaseEntityPrivate).__meta.key, instance.uuid, key].join(this.keySeparator);
  }
}
