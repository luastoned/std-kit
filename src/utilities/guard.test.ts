import { describe, it, expect } from 'vitest';
import { guard } from './guard';

describe('guard', () => {
  describe('synchronous functions', () => {
    it('returns the result when function succeeds', () => {
      const result = guard(() => 42);
      expect(result).toBe(42);
    });

    it('returns undefined when function throws', () => {
      const result = guard(() => {
        throw new Error('test error');
      });
      expect(result).toBeUndefined();
    });

    it('returns undefined when JSON.parse fails', () => {
      const result = guard(() => JSON.parse('invalid json'));
      expect(result).toBeUndefined();
    });

    it('re-throws error when shouldGuard returns false', () => {
      expect(() =>
        guard(
          () => {
            throw new TypeError('type error');
          },
          (err) => err instanceof SyntaxError, // only guard SyntaxError
        ),
      ).toThrow(TypeError);
    });

    it('catches error when shouldGuard returns true', () => {
      const result = guard(
        () => {
          throw new TypeError('type error');
        },
        (err) => err instanceof TypeError,
      );
      expect(result).toBeUndefined();
    });

    it('works with complex return types', () => {
      const result = guard(() => ({ name: 'Alice', age: 30 }));
      expect(result).toEqual({ name: 'Alice', age: 30 });
    });
  });

  describe('asynchronous functions', () => {
    it('returns the result when async function succeeds', async () => {
      const result = await guard(async () => 42);
      expect(result).toBe(42);
    });

    it('returns undefined when async function rejects', async () => {
      const result = await guard(async () => {
        throw new Error('async error');
      });
      expect(result).toBeUndefined();
    });

    it('returns undefined when Promise rejects', async () => {
      const result = await guard(() => Promise.reject(new Error('rejected')));
      expect(result).toBeUndefined();
    });

    it('re-throws error when shouldGuard returns false for async', async () => {
      await expect(
        guard(
          async () => {
            throw new TypeError('type error');
          },
          (err) => err instanceof SyntaxError,
        ),
      ).rejects.toThrow(TypeError);
    });

    it('catches error when shouldGuard returns true for async', async () => {
      const result = await guard(
        async () => {
          throw new TypeError('type error');
        },
        (err) => err instanceof TypeError,
      );
      expect(result).toBeUndefined();
    });

    it('works with async operations', async () => {
      const result = await guard(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'done';
      });
      expect(result).toBe('done');
    });

    it('handles Promise.resolve correctly', async () => {
      const result = await guard(() => Promise.resolve({ data: 'test' }));
      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('edge cases', () => {
    it('handles null return value', () => {
      const result = guard(() => null);
      expect(result).toBeNull();
    });

    it('handles undefined return value', () => {
      const result = guard(() => undefined);
      expect(result).toBeUndefined();
    });

    it('handles false return value', () => {
      const result = guard(() => false);
      expect(result).toBe(false);
    });

    it('handles zero return value', () => {
      const result = guard(() => 0);
      expect(result).toBe(0);
    });

    it('handles empty string return value', () => {
      const result = guard(() => '');
      expect(result).toBe('');
    });

    it('handles non-Error thrown values', () => {
      const result = guard(() => {
        throw 'string error';
      });
      expect(result).toBeUndefined();
    });

    it('shouldGuard receives the actual error', () => {
      let capturedError: unknown;
      guard(
        () => {
          throw new Error('captured');
        },
        (err) => {
          capturedError = err;
          return true;
        },
      );
      expect(capturedError).toBeInstanceOf(Error);
      expect((capturedError as Error).message).toBe('captured');
    });
  });
});
