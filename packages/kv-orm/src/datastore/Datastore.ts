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

  public abstract write(key: string, value: any): Promise<void>;

  public abstract delete(key: string): Promise<void>;

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

  public generateKey(instance: BaseEntity, key?: string, relation?: BaseEntity): string {
    const elements = [(instance as BaseEntityPrivate).__meta.key, instance.uuid];
    if (key !== undefined) {
      elements.push(key);
    }
    if (relation !== undefined) {
      elements.push((relation as BaseEntityPrivate).__meta.key, relation.uuid);
    }
    return elements.join(this.keySeparator);
  }

  public generateSearchTerm(instance: BaseEntity, key: string, relation: typeof BaseEntity): string {
    const elements = [(instance as BaseEntityPrivate).__meta.key, instance.uuid, key, (relation as any).__meta.key];
    return elements.join(this.keySeparator);
  }

  public extractUUIDFromKey(keyPrefix: string, key: string) {
    const prefix = `${keyPrefix}${this.keySeparator}`;

    if (!key.startsWith(prefix)) {
      throw new Error(`Could not extract UUID from key, ${key}`);
    }

    return key.split(prefix)[1].split(this.keySeparator)[0];
  }
}
