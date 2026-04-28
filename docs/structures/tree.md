# tree

[← Back to std-kit](../../README.md)

---

## Functions

- `findTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, predicate: TreePredicate<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode | undefined`
- `flattenTree<TNode, TChildKey = "children">(tree: Readonly<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode[]`
- `insertTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, parentTarget: TreeTarget<TNode>, node: TNode, options?: Readonly<TreeInsertOptions<TChildKey>>): TNode`
- `mapTree<TNode, TChildKey = "children">(tree: Readonly<TNode>, mapper: TreeMapper<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode`
- `queryTree<TNode, TChildKey = "children">(tree: Readonly<TNode>, predicate: TreePredicate<TNode>, options?: Readonly<TreeQueryOptions<TChildKey>>): TNode[]`
- `removeTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, target: TreeTarget<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode | undefined`
- `replaceTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, target: TreeTarget<TNode>, replacement: TNode, options?: Readonly<TreeOptions<TChildKey>>): TNode`
- `updateTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, target: TreeTarget<TNode>, updater: TreeUpdater<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode`
- `walkTree<TNode, TChildKey = "children">(tree: Readonly<TNode>, visitor: TreeVisitor<TNode>, options?: Readonly<TreeOptions<TChildKey>>): void`

## Types

- `type TreeMapper<TNode> = (node: TNode, context: TreeContext<TNode>) => TNode`
- `type TreeNode<TData = Record<string, unknown>, TChildKey = "children"> = TData & Partial<Record<TChildKey, readonly TreeNode<TData, TChildKey>[]>>`
- `type TreePath = readonly number[]`
- `type TreePredicate<TNode> = (node: TNode, context: TreeContext<TNode>) => boolean`
- `type TreeTarget<TNode> = TreePath | TreePredicate<TNode>`
- `type TreeUpdater<TNode> = (node: TNode, context: TreeContext<TNode>) => TNode`
- `type TreeVisitControl = void | "skip" | "stop"`
- `type TreeVisitor<TNode> = (node: TNode, context: TreeContext<TNode>) => TreeVisitControl`

---

## TreeMapper

```typescript
type TreeMapper<TNode> = (node: TNode, context: TreeContext<TNode>) => TNode;
```

Mapper used to transform tree nodes.

---

## TreeNode

```typescript
type TreeNode<TData = Record<string, unknown>, TChildKey = 'children'> = TData & Partial<Record<TChildKey, readonly TreeNode<TData, TChildKey>[]>>;
```

Represents a recursive tree node with a configurable child key.

---

## TreePath

```typescript
type TreePath = readonly number[];
```

Represents a path to a node using child indices.

---

## TreePredicate

```typescript
type TreePredicate<TNode> = (node: TNode, context: TreeContext<TNode>) => boolean;
```

Predicate used to match tree nodes.

---

## TreeTarget

```typescript
type TreeTarget<TNode> = TreePath | TreePredicate<TNode>;
```

Target used to address a tree node by path or predicate.

---

## TreeUpdater

```typescript
type TreeUpdater<TNode> = (node: TNode, context: TreeContext<TNode>) => TNode;
```

Updater used to transform a matched tree node.

---

## TreeVisitControl

```typescript
type TreeVisitControl = void | 'skip' | 'stop';
```

Controls depth-first traversal in `walkTree`.

---

## TreeVisitor

```typescript
type TreeVisitor<TNode> = (node: TNode, context: TreeContext<TNode>) => TreeVisitControl;
```

Visitor used during tree traversal.

---

## findTreeNode

```typescript
findTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, predicate: TreePredicate<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode | undefined
```

Finds the first tree node that matches a predicate.

Matching uses depth-first preorder traversal.

**Returns:** The first matching node, or `undefined` when no node matches.

---

## flattenTree

```typescript
flattenTree<TNode, TChildKey = "children">(tree: Readonly<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode[]
```

Flattens a tree into a preorder array of nodes.

**Returns:** A preorder array containing every visited node.

---

## insertTreeNode

```typescript
insertTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, parentTarget: TreeTarget<TNode>, node: TNode, options?: Readonly<TreeInsertOptions<TChildKey>>): TNode
```

Inserts a node into the children of the first matching parent target.

Matching uses depth-first preorder traversal.

**Returns:** A new tree when insertion succeeds, otherwise the original tree.

---

## mapTree

```typescript
mapTree<TNode, TChildKey = "children">(tree: Readonly<TNode>, mapper: TreeMapper<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode
```

Maps a tree into a new tree by transforming each node.

Mapping uses depth-first preorder traversal. Child traversal continues from the mapped node's current children.

**Returns:** A new mapped tree.

---

## queryTree

```typescript
queryTree<TNode, TChildKey = "children">(tree: Readonly<TNode>, predicate: TreePredicate<TNode>, options?: Readonly<TreeQueryOptions<TChildKey>>): TNode[]
```

Queries all tree nodes that match a predicate.

Matching uses depth-first preorder traversal.

**Returns:** All matching nodes in depth-first preorder.

---

## removeTreeNode

```typescript
removeTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, target: TreeTarget<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode | undefined
```

Removes the first tree node that matches a target.

Matching uses depth-first preorder traversal.

**Returns:** A new tree without the matched node, or `undefined` when the root is removed.

---

## replaceTreeNode

```typescript
replaceTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, target: TreeTarget<TNode>, replacement: TNode, options?: Readonly<TreeOptions<TChildKey>>): TNode
```

Replaces the first tree node that matches a target.

Matching uses depth-first preorder traversal.

**Returns:** A new tree when a node is replaced, otherwise the original tree.

---

## updateTreeNode

```typescript
updateTreeNode<TNode, TChildKey = "children">(tree: Readonly<TNode>, target: TreeTarget<TNode>, updater: TreeUpdater<TNode>, options?: Readonly<TreeOptions<TChildKey>>): TNode
```

Updates the first tree node that matches a target.

Matching uses depth-first preorder traversal.

**Returns:** A new tree when a node is updated, otherwise the original tree.

---

## walkTree

```typescript
walkTree<TNode, TChildKey = "children">(tree: Readonly<TNode>, visitor: TreeVisitor<TNode>, options?: Readonly<TreeOptions<TChildKey>>): void
```

Walks a tree in depth-first preorder.

Returning `'skip'` skips the current node's descendants. Returning `'stop'` stops traversal entirely.

**Returns:** Nothing.

---
