import { type Readable, Writable } from 'node:stream';

/**
 * Converts a readable stream into a buffer.
 *
 * @param stream - The readable stream to convert.
 * @returns A promise that resolves with the concatenated buffer of all chunks read from the stream.
 */
export const streamToBuffer = (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => chunks.push(chunk));
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
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    stream.pipe(writable);

    writable.on('finish', () => resolve(Buffer.concat(chunks)));
    writable.on('error', reject);
  });
};
