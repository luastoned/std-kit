# buffer

[← Back to std-kit](../../README.md)

---

## Functions

- `streamToBuffer(stream: Readable, options: Readonly<StreamToBufferOptions> = {}): Promise<Buffer<ArrayBufferLike>>`

## Types

- `interface StreamToBufferOptions`

---

## StreamToBufferOptions

```typescript
interface StreamToBufferOptions {
  readonly maxBytes?: number;
}
```

Options for collecting a readable stream into a buffer.

---

## streamToBuffer

```typescript
streamToBuffer(stream: Readable, options: Readonly<StreamToBufferOptions> = {}): Promise<Buffer<ArrayBufferLike>>
```

Converts a readable stream into a buffer.


**Returns:** A promise that resolves with the concatenated buffer of all chunks read from the stream.


**Throws:** TypeError if the stream emits a chunk that cannot be converted to a buffer.


**Throws:** RangeError if `maxBytes` is invalid or the stream exceeds it.


---

