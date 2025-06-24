import { describe, it, expect } from 'vitest';
import { Readable } from 'node:stream';
import { streamToBuffer, pipeToBuffer } from './buffer';

describe('streamToBuffer', () => {
  it('converts a stream to a buffer correctly', async () => {
    const input = ['Hello', ' ', 'World'];
    const stream = Readable.from(input.map((s) => Buffer.from(s)));

    const result = await streamToBuffer(stream);
    expect(result.toString()).toBe('Hello World');
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

describe('pipeToBuffer', () => {
  it('pipes a stream to a buffer correctly', async () => {
    const input = ['foo', 'bar', 'baz'];
    const stream = Readable.from(input.map((s) => Buffer.from(s)));

    const result = await pipeToBuffer(stream);
    expect(result.toString()).toBe('foobarbaz');
  });

  it('handles pipe error', async () => {
    const errorStream = new Readable({
      read() {
        this.destroy(new Error('Pipe error'));
      },
    });

    await expect(pipeToBuffer(errorStream)).rejects.toThrow('Pipe error');
  });
});
