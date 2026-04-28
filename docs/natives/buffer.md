# buffer

[← Back to std-kit](../../README.md)

---

## Functions

- `pipeToBuffer(stream: Readable): Promise<Buffer<ArrayBufferLike>>`
- `streamToBuffer(stream: Readable): Promise<Buffer<ArrayBufferLike>>`

---

## pipeToBuffer

```typescript
pipeToBuffer(stream: Readable): Promise<Buffer<ArrayBufferLike>>
```

Pipes a readable stream to a buffer.

**Returns:** A promise that resolves to a buffer containing the data from the stream.

---

## streamToBuffer

```typescript
streamToBuffer(stream: Readable): Promise<Buffer<ArrayBufferLike>>
```

Converts a readable stream into a buffer.

**Returns:** A promise that resolves with the concatenated buffer of all chunks read from the stream.

---
