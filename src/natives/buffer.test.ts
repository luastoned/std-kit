import { Readable } from 'node:stream';

import { describe, it, expect } from 'vitest';

import { streamToBuffer } from './buffer';

describe('streamToBuffer', () => {
  it('converts a stream to a buffer correctly', async () => {
    const input = ['Hello', ' ', 'World'];
    const stream = Readable.from(input.map((s) => Buffer.from(s)));

    const result = await streamToBuffer(stream);
    expect(result.toString()).toBe('Hello World');
  });

  it('converts string chunks to a buffer correctly', async () => {
    const stream = Readable.from(['Hello', ' ', 'World']);
    const result = await streamToBuffer(stream);
    expect(result.toString()).toBe('Hello World');
  });

  it('converts Uint8Array chunks to a buffer correctly', async () => {
    const stream = Readable.from([new Uint8Array([72, 105])]);
    const result = await streamToBuffer(stream);
    expect(result.toString()).toBe('Hi');
  });

  it('allows a stream exactly at the configured byte limit', async () => {
    const result = await streamToBuffer(Readable.from(['Hello']), { maxBytes: 5 });

    expect(result.toString()).toBe('Hello');
  });

  it('rejects and destroys a stream that exceeds the configured byte limit', async () => {
    const stream = Readable.from(['€']);

    await expect(streamToBuffer(stream, { maxBytes: 2 })).rejects.toThrow('Stream exceeds the maximum size of 2 bytes.');
    expect(stream.destroyed).toBe(true);
  });

  it.each([-1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1])('rejects an invalid byte limit of %s', async (maxBytes) => {
    await expect(streamToBuffer(Readable.from([]), { maxBytes })).rejects.toThrow('maxBytes must be a non-negative safe integer or Infinity.');
  });

  it('rejects unsupported object-mode chunks', async () => {
    const stream = Readable.from([{ message: 'Hello' }]);

    await expect(streamToBuffer(stream)).rejects.toThrow('Stream chunks must be strings, Buffers, or Uint8Arrays.');
  });

  it('handles stream error', async () => {
    const errorStream = new Readable({
      read() {
        this.destroy(new Error('Test stream error'));
      },
    });

    await expect(streamToBuffer(errorStream)).rejects.toThrow('Test stream error');
  });
});
