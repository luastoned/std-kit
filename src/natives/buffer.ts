import { type Readable, Writable } from 'node:stream';

/**
 * Normalizes stream chunks into buffers.
 *
 * @param chunk - Raw stream chunk.
 * @returns A buffer representation of the chunk.
 * @internal
 */
function toBuffer(chunk: string | Buffer | Uint8Array): Buffer {
  return Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
}

/**
 * Converts a readable stream into a buffer.
 *
 * @example
 *   ```ts
 *   import { Readable } from 'node:stream';
 *   import { streamToBuffer } from 'std-kit/node';
 *
 *   const stream = Readable.from(['hello ', 'world']);
 *   const buffer = await streamToBuffer(stream);
 *
 *   buffer.toString();
 *   // 'hello world'
 *   ```;
 *
 * @param stream - The readable stream to convert.
 * @returns A promise that resolves with the concatenated buffer of all chunks read from the stream.
 */
export function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk: string | Buffer | Uint8Array) => chunks.push(toBuffer(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

/**
 * Pipes a readable stream to a buffer.
 *
 * @example
 *   ```ts
 *   import { Readable } from 'node:stream';
 *   import { pipeToBuffer } from 'std-kit/node';
 *
 *   const stream = Readable.from(['a', 'b', 'c']);
 *   const buffer = await pipeToBuffer(stream);
 *
 *   buffer.toString();
 *   // 'abc'
 *   ```;
 *
 * @param stream - The readable stream to pipe.
 * @returns A promise that resolves to a buffer containing the data from the stream.
 */
export function pipeToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const writable = new Writable({
      write(chunk: string | Buffer | Uint8Array, encoding, callback) {
        chunks.push(toBuffer(chunk));
        callback();
      },
    });

    writable.on('error', reject);
    writable.on('finish', () => resolve(Buffer.concat(chunks)));

    stream.on('error', reject);
    stream.pipe(writable);
  });
}
