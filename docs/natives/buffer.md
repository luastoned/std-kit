# buffer

[← Back to std-kit](../../README.md)

---

## Functions

- `pipeToBuffer(stream: Readable): Promise`
- `streamToBuffer(stream: Readable): Promise`

---

## pipeToBuffer

```typescript
pipeToBuffer(stream: Readable): Promise
```

Pipes a readable stream to a buffer.


**Returns:** A promise that resolves to a buffer containing the data from the stream.


---

## streamToBuffer

```typescript
streamToBuffer(stream: Readable): Promise
```

Converts a readable stream into a buffer.


**Returns:** A promise that resolves with the concatenated buffer of all chunks read from the stream.


---

