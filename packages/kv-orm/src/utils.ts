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

export function hexToArrayBuffer(hexString: string): ArrayBuffer {
  return new Uint8Array(hexString.match(/[\da-f]{2}/gi)!.map((hexNumber) => parseInt(hexNumber, 16))).buffer;
}

export function arrayBufferToHex(arrayBuffer: ArrayBuffer): string {
  return '';
}
