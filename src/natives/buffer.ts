import { type Readable, Writable } from 'node:stream';

/**
 * Normalizes stream chunks into buffers.
 *
 * @internal
 * @param chunk - Raw stream chunk.
 * @returns A buffer representation of the chunk.
 */
const toBuffer = (chunk: string | Buffer | Uint8Array): Buffer => (Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));

/**
 * Converts a readable stream into a buffer.
 *
 * @param stream - The readable stream to convert.
 * @returns A promise that resolves with the concatenated buffer of all chunks read from the stream.
 */
export const streamToBuffer = (stream: Readable): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk: string | Buffer | Uint8Array) => chunks.push(toBuffer(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

/**
 * Pipes a readable stream to a buffer.
 *
 * @param stream - The readable stream to pipe.
 * @returns A promise that resolves to a buffer containing the data from the stream.
 */
export const pipeToBuffer = (stream: Readable): Promise<Buffer> => {
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
};
