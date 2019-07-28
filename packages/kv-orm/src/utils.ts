import uuidv4 from 'uuid/v4';

export function uuid(): string {
  return uuidv4();
}

export function hexToArrayBuffer(hexString: string): ArrayBuffer {
  const groups = hexString.match(/[\da-f]{2}/gi);
  if (groups === null) return (null as any) as ArrayBuffer;
  return new Uint8Array(groups.map(hexNumber => parseInt(hexNumber, 16))).buffer;
}

export function arrayBufferToHex(arrayBuffer: ArrayBuffer): string {
  const array = new Uint8Array(arrayBuffer);
  let result = '';

  for (const i of array) {
    const value = i.toString(16);
    result += value.length === 1 ? '0' + value : value;
  }

  return result;
}
