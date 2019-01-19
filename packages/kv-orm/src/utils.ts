import uuidv4 from 'uuid/v4';

export function isRelatedInstanceOf(instance: any, target: any): boolean {
  return (
    instance.constructor.prototype instanceof target ||
    instance.constructor === target ||
    instance.constructor.prototype === target.prototype
  );
}

export function uuid(): string {
  return uuidv4();
}
