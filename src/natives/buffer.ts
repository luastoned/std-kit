import type { Readable } from 'node:stream';

/**
 * Normalizes stream chunks into buffers.
 *
 * @param chunk - Raw stream chunk.
 * @returns A buffer representation of the chunk.
 * @internal
 */
function streamChunkToBuffer(chunk: unknown): Buffer {
  if (Buffer.isBuffer(chunk)) {
    return chunk;
  }

  if (typeof chunk === 'string' || chunk instanceof Uint8Array) {
    return Buffer.from(chunk);
  }

  throw new TypeError('Stream chunks must be strings, Buffers, or Uint8Arrays.');
}

/**
 * Options for collecting a readable stream into a buffer.
 */
export interface StreamToBufferOptions {
  /**
   * Maximum number of bytes to collect. Omit to allow any size supported by Node.js.
   */
  readonly maxBytes?: number;
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
 *   const buffer = await streamToBuffer(stream, { maxBytes: 1024 });
 *
 *   buffer.toString();
 *   // 'hello world'
 *   ```;
 *
 * @param stream - The readable stream to convert.
 * @param options - Optional collection limits.
 * @returns A promise that resolves with the concatenated buffer of all chunks read from the stream.
 * @throws TypeError if the stream emits a chunk that cannot be converted to a buffer.
 * @throws RangeError if `maxBytes` is invalid or the stream exceeds it.
 */
export async function streamToBuffer(stream: Readable, options: Readonly<StreamToBufferOptions> = {}): Promise<Buffer> {
  const maxBytes = options.maxBytes ?? Number.POSITIVE_INFINITY;
  if (maxBytes !== Number.POSITIVE_INFINITY && (!Number.isSafeInteger(maxBytes) || maxBytes < 0)) {
    throw new RangeError('maxBytes must be a non-negative safe integer or Infinity.');
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of stream) {
    const buffer = streamChunkToBuffer(chunk);
    if (buffer.length > maxBytes - totalBytes) {
      throw new RangeError(`Stream exceeds the maximum size of ${maxBytes} bytes.`);
    }

    chunks.push(buffer);
    totalBytes += buffer.length;
  }

  return Buffer.concat(chunks, totalBytes);
}
