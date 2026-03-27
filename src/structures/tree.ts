/**
 * Represents a path to a node using child indices.
 *
 * @example
 * `[1, 0, 2]` targets the third child of the first child of the second root descendant.
 */
export type TreePath = readonly number[];

/**
 * Represents a recursive tree node with a configurable child key.
 *
 * @template TData - The node payload shape.
 * @template TChildKey - The property key used for child nodes.
 */
export type TreeNode<TData extends object = Record<string, unknown>, TChildKey extends PropertyKey = 'children'> = TData &
  Partial<Record<TChildKey, readonly TreeNode<TData, TChildKey>[]>>;

/**
 * Runtime traversal context for a tree node.
 *
 * @template TNode - The node type.
 */
export interface TreeContext<TNode> {
  parent: TNode | null;
  path: TreePath;
  depth: number;
  index: number;
}

/**
 * Controls depth-first traversal in `walkTree`.
 */
export type TreeVisitControl = void | 'skip' | 'stop';

/**
 * Predicate used to match tree nodes.
 *
 * @template TNode - The node type.
 */
export type TreePredicate<TNode> = (node: TNode, context: TreeContext<TNode>) => boolean;

/**
 * Visitor used during tree traversal.
 *
 * @template TNode - The node type.
 */
export type TreeVisitor<TNode> = (node: TNode, context: TreeContext<TNode>) => TreeVisitControl;

/**
 * Mapper used to transform tree nodes.
 *
 * @template TNode - The node type.
 */
export type TreeMapper<TNode> = (node: TNode, context: TreeContext<TNode>) => TNode;

/**
 * Updater used to transform a matched tree node.
 *
 * @template TNode - The node type.
 */
export type TreeUpdater<TNode> = (node: TNode, context: TreeContext<TNode>) => TNode;

/**
 * Target used to address a tree node by path or predicate.
 *
 * @template TNode - The node type.
 */
export type TreeTarget<TNode> = TreePath | TreePredicate<TNode>;

/**
 * Shared tree configuration.
 *
 * @template TChildKey - The property key used for child nodes.
 */
export interface TreeOptions<TChildKey extends PropertyKey = 'children'> {
  childrenKey?: TChildKey;
}

/**
 * Query options for tree searches.
 *
 * @template TChildKey - The property key used for child nodes.
 */
export interface TreeQueryOptions<TChildKey extends PropertyKey = 'children'> extends TreeOptions<TChildKey> {
  maxResults?: number;
}

/**
 * Insert options for tree mutation helpers.
 *
 * @template TChildKey - The property key used for child nodes.
 */
export interface TreeInsertOptions<TChildKey extends PropertyKey = 'children'> extends TreeOptions<TChildKey> {
  position?: 'prepend' | 'append' | number;
}

/**
 * Normalized tree options used internally.
 *
 * @internal
 */
interface TreeRuntimeOptions<TChildKey extends PropertyKey> {
  childrenKey: TChildKey;
}

/**
 * Result of a recursive tree transform.
 *
 * @internal
 */
interface TreeTransformResult<TNode> {
  node: TNode | undefined;
  changed: boolean;
}

/**
 * Normalizes tree options with defaults.
 *
 * @internal
 * @template TChildKey - The property key used for child nodes.
 * @param options - Raw tree options.
 * @returns Normalized runtime options.
 */
function normalizeTreeOptions<TChildKey extends PropertyKey = 'children'>(options?: Readonly<TreeOptions<TChildKey>>): TreeRuntimeOptions<TChildKey> {
  return {
    childrenKey: (options?.childrenKey ?? 'children') as TChildKey,
  };
}

/**
 * Returns the child nodes of a tree node.
 *
 * @internal
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param node - The source node.
 * @param childrenKey - The child property key.
 * @returns A readonly array of child nodes.
 */
function getTreeChildren<TNode extends object, TChildKey extends PropertyKey>(node: TNode, childrenKey: TChildKey): readonly TNode[] {
  const candidate = (node as Record<PropertyKey, unknown>)[childrenKey];
  return Array.isArray(candidate) ? (candidate as readonly TNode[]) : [];
}

/**
 * Checks whether a node explicitly defines the configured child key.
 *
 * @internal
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param node - The source node.
 * @param childrenKey - The child property key.
 * @returns `true` when the node has the child key.
 */
function hasChildrenKey<TNode extends object, TChildKey extends PropertyKey>(node: TNode, childrenKey: TChildKey): boolean {
  return childrenKey in (node as Record<PropertyKey, unknown>);
}

/**
 * Creates a shallow-cloned node with updated children.
 *
 * @internal
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param node - The source node.
 * @param childrenKey - The child property key.
 * @param children - The next child nodes.
 * @returns A cloned node with updated children.
 */
function cloneNodeWithChildren<TNode extends object, TChildKey extends PropertyKey>(node: TNode, childrenKey: TChildKey, children: readonly TNode[]): TNode {
  const clone = { ...(node as Record<PropertyKey, unknown>) };
  if (children.length > 0 || hasChildrenKey(node, childrenKey)) {
    clone[childrenKey] = [...children];
  } else {
    delete clone[childrenKey];
  }

  return clone as TNode;
}

/**
 * Checks whether a target matches the current traversal position.
 *
 * @internal
 * @template TNode - The node type.
 * @param node - The current node.
 * @param context - The traversal context.
 * @param target - The target path or predicate.
 * @returns `true` when the target matches the current node.
 */
function matchesTreeTarget<TNode>(node: TNode, context: TreeContext<TNode>, target: TreeTarget<TNode>): boolean {
  if (typeof target === 'function') {
    return target(node, context);
  }

  return target.length === context.path.length && target.every((segment, index) => segment === context.path[index]);
}

/**
 * Normalizes the insertion position for a child array.
 *
 * @internal
 * @param position - Desired insertion position.
 * @param length - Current child array length.
 * @returns A clamped insertion index.
 */
function normalizeInsertPosition(position: TreeInsertOptions['position'], length: number): number {
  if (position === 'prepend') {
    return 0;
  }

  if (position === 'append' || position === undefined) {
    return length;
  }

  if (!Number.isFinite(position)) {
    return length;
  }

  const normalized = Math.floor(position);
  return Math.max(0, Math.min(length, normalized));
}

/**
 * Walks a tree in depth-first preorder.
 *
 * Returning `'skip'` skips the current node's descendants. Returning `'stop'` stops traversal entirely.
 *
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param tree - The root node.
 * @param visitor - Visitor called for each node.
 * @param options - Tree traversal options.
 * @returns Nothing.
 */
export function walkTree<TNode extends object, TChildKey extends PropertyKey = 'children'>(
  tree: Readonly<TNode>,
  visitor: TreeVisitor<TNode>,
  options?: Readonly<TreeOptions<TChildKey>>,
): void {
  const { childrenKey } = normalizeTreeOptions(options);
  const visiting = new WeakSet<object>();
  let stopped = false;

  function visit(node: TNode, context: TreeContext<TNode>): void {
    if (stopped || visiting.has(node as object)) {
      return;
    }

    visiting.add(node as object);
    try {
      const control = visitor(node, context);
      if (control === 'stop') {
        stopped = true;
        return;
      }

      if (control === 'skip') {
        return;
      }

      const children = getTreeChildren(node, childrenKey);
      for (let index = 0; index < children.length && !stopped; index++) {
        const child = children[index];
        visit(child, {
          parent: node,
          path: [...context.path, index],
          depth: context.depth + 1,
          index,
        });
      }
    } finally {
      visiting.delete(node as object);
    }
  }

  visit(tree as TNode, {
    parent: null,
    path: [],
    depth: 0,
    index: 0,
  });
}

/**
 * Finds the first tree node that matches a predicate.
 *
 * Matching uses depth-first preorder traversal.
 *
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param tree - The root node.
 * @param predicate - Predicate used to match a node.
 * @param options - Tree traversal options.
 * @returns The first matching node, or `undefined` when no node matches.
 */
export function findTreeNode<TNode extends object, TChildKey extends PropertyKey = 'children'>(
  tree: Readonly<TNode>,
  predicate: TreePredicate<TNode>,
  options?: Readonly<TreeOptions<TChildKey>>,
): TNode | undefined {
  let match: TNode | undefined;

  walkTree(
    tree,
    (node, context) => {
      if (!predicate(node, context)) {
        return;
      }

      match = node;
      return 'stop';
    },
    options,
  );

  return match;
}

/**
 * Queries all tree nodes that match a predicate.
 *
 * Matching uses depth-first preorder traversal.
 *
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param tree - The root node.
 * @param predicate - Predicate used to match nodes.
 * @param options - Tree query options.
 * @returns All matching nodes in depth-first preorder.
 */
export function queryTree<TNode extends object, TChildKey extends PropertyKey = 'children'>(
  tree: Readonly<TNode>,
  predicate: TreePredicate<TNode>,
  options?: Readonly<TreeQueryOptions<TChildKey>>,
): TNode[] {
  const results: TNode[] = [];
  const maxResults = options?.maxResults;

  walkTree(
    tree,
    (node, context) => {
      if (predicate(node, context)) {
        results.push(node);
        if (maxResults !== undefined && results.length >= maxResults) {
          return 'stop';
        }
      }

      return;
    },
    options,
  );

  return results;
}

/**
 * Flattens a tree into a preorder array of nodes.
 *
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param tree - The root node.
 * @param options - Tree traversal options.
 * @returns A preorder array containing every visited node.
 */
export function flattenTree<TNode extends object, TChildKey extends PropertyKey = 'children'>(
  tree: Readonly<TNode>,
  options?: Readonly<TreeOptions<TChildKey>>,
): TNode[] {
  const nodes: TNode[] = [];

  walkTree(
    tree,
    (node) => {
      nodes.push(node);
    },
    options,
  );

  return nodes;
}

/**
 * Maps a tree into a new tree by transforming each node.
 *
 * Mapping uses depth-first preorder traversal. Child traversal continues from the mapped node's current children.
 *
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param tree - The root node.
 * @param mapper - Mapper used to transform each node.
 * @param options - Tree traversal options.
 * @returns A new mapped tree.
 */
export function mapTree<TNode extends object, TChildKey extends PropertyKey = 'children'>(
  tree: Readonly<TNode>,
  mapper: TreeMapper<TNode>,
  options?: Readonly<TreeOptions<TChildKey>>,
): TNode {
  const { childrenKey } = normalizeTreeOptions(options);
  const visiting = new WeakSet<object>();

  function visit(node: TNode, context: TreeContext<TNode>): TNode {
    if (visiting.has(node as object)) {
      return node;
    }

    visiting.add(node as object);
    try {
      const mappedNode = mapper(node, context);
      const mappedChildren = getTreeChildren(mappedNode, childrenKey);
      if (mappedChildren.length === 0) {
        return mappedNode;
      }

      const nextChildren = mappedChildren.map((child, index) =>
        visit(child, {
          parent: mappedNode,
          path: [...context.path, index],
          depth: context.depth + 1,
          index,
        }),
      );

      return cloneNodeWithChildren(mappedNode, childrenKey, nextChildren);
    } finally {
      visiting.delete(node as object);
    }
  }

  return visit(tree as TNode, {
    parent: null,
    path: [],
    depth: 0,
    index: 0,
  });
}

/**
 * Updates the first tree node that matches a target.
 *
 * Matching uses depth-first preorder traversal.
 *
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param tree - The root node.
 * @param target - Target path or predicate.
 * @param updater - Updater used to transform the matched node.
 * @param options - Tree traversal options.
 * @returns A new tree when a node is updated, otherwise the original tree.
 */
export function updateTreeNode<TNode extends object, TChildKey extends PropertyKey = 'children'>(
  tree: Readonly<TNode>,
  target: TreeTarget<TNode>,
  updater: TreeUpdater<TNode>,
  options?: Readonly<TreeOptions<TChildKey>>,
): TNode {
  const { childrenKey } = normalizeTreeOptions(options);
  const state = { matched: false };
  const visiting = new WeakSet<object>();

  function visit(node: TNode, context: TreeContext<TNode>): TNode {
    if (visiting.has(node as object)) {
      return node;
    }

    visiting.add(node as object);
    try {
      const currentNode = !state.matched && matchesTreeTarget(node, context, target) ? ((state.matched = true), updater(node, context)) : node;
      const children = getTreeChildren(currentNode, childrenKey);
      if (children.length === 0) {
        return currentNode;
      }

      let changed = currentNode !== node;
      let nextChildren: TNode[] | undefined;

      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const nextChild = visit(child, {
          parent: currentNode,
          path: [...context.path, index],
          depth: context.depth + 1,
          index,
        });

        if (nextChild !== child) {
          if (!nextChildren) {
            nextChildren = [...children];
          }

          nextChildren[index] = nextChild;
          changed = true;
        }
      }

      if (!changed) {
        return node;
      }

      return nextChildren ? cloneNodeWithChildren(currentNode, childrenKey, nextChildren) : currentNode;
    } finally {
      visiting.delete(node as object);
    }
  }

  return visit(tree as TNode, {
    parent: null,
    path: [],
    depth: 0,
    index: 0,
  });
}

/**
 * Replaces the first tree node that matches a target.
 *
 * Matching uses depth-first preorder traversal.
 *
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param tree - The root node.
 * @param target - Target path or predicate.
 * @param replacement - Replacement node.
 * @param options - Tree traversal options.
 * @returns A new tree when a node is replaced, otherwise the original tree.
 */
export function replaceTreeNode<TNode extends object, TChildKey extends PropertyKey = 'children'>(
  tree: Readonly<TNode>,
  target: TreeTarget<TNode>,
  replacement: TNode,
  options?: Readonly<TreeOptions<TChildKey>>,
): TNode {
  return updateTreeNode(tree, target, () => replacement, options);
}

/**
 * Removes the first tree node that matches a target.
 *
 * Matching uses depth-first preorder traversal.
 *
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param tree - The root node.
 * @param target - Target path or predicate.
 * @param options - Tree traversal options.
 * @returns A new tree without the matched node, or `undefined` when the root is removed.
 */
export function removeTreeNode<TNode extends object, TChildKey extends PropertyKey = 'children'>(
  tree: Readonly<TNode>,
  target: TreeTarget<TNode>,
  options?: Readonly<TreeOptions<TChildKey>>,
): TNode | undefined {
  const { childrenKey } = normalizeTreeOptions(options);
  const state = { matched: false };
  const visiting = new WeakSet<object>();

  function visit(node: TNode, context: TreeContext<TNode>): TreeTransformResult<TNode> {
    if (visiting.has(node as object)) {
      return { node, changed: false };
    }

    if (!state.matched && matchesTreeTarget(node, context, target)) {
      state.matched = true;
      return { node: undefined, changed: true };
    }

    visiting.add(node as object);
    try {
      const children = getTreeChildren(node, childrenKey);
      if (children.length === 0) {
        return { node, changed: false };
      }

      let changed = false;
      let nextChildren: TNode[] | undefined;

      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const result = visit(child, {
          parent: node,
          path: [...context.path, index],
          depth: context.depth + 1,
          index,
        });

        if (!changed && (result.changed || result.node !== child)) {
          nextChildren = children.slice(0, index) as TNode[];
          changed = true;
        }

        if (nextChildren && result.node !== undefined) {
          nextChildren.push(result.node);
        }
      }

      if (!changed || !nextChildren) {
        return { node, changed: false };
      }

      return {
        node: cloneNodeWithChildren(node, childrenKey, nextChildren),
        changed: true,
      };
    } finally {
      visiting.delete(node as object);
    }
  }

  return visit(tree as TNode, {
    parent: null,
    path: [],
    depth: 0,
    index: 0,
  }).node;
}

/**
 * Inserts a node into the children of the first matching parent target.
 *
 * Matching uses depth-first preorder traversal.
 *
 * @template TNode - The node type.
 * @template TChildKey - The property key used for child nodes.
 * @param tree - The root node.
 * @param parentTarget - Parent target path or predicate.
 * @param node - Node to insert.
 * @param options - Tree insertion options.
 * @returns A new tree when insertion succeeds, otherwise the original tree.
 */
export function insertTreeNode<TNode extends object, TChildKey extends PropertyKey = 'children'>(
  tree: Readonly<TNode>,
  parentTarget: TreeTarget<TNode>,
  node: TNode,
  options?: Readonly<TreeInsertOptions<TChildKey>>,
): TNode {
  const { childrenKey } = normalizeTreeOptions(options);
  const state = { matched: false };
  const visiting = new WeakSet<object>();

  function visit(currentNode: TNode, context: TreeContext<TNode>): TNode {
    if (visiting.has(currentNode as object)) {
      return currentNode;
    }

    visiting.add(currentNode as object);
    try {
      if (!state.matched && matchesTreeTarget(currentNode, context, parentTarget)) {
        state.matched = true;
        const children = getTreeChildren(currentNode, childrenKey);
        const index = normalizeInsertPosition(options?.position, children.length);
        const nextChildren = [...children.slice(0, index), node, ...children.slice(index)];
        return cloneNodeWithChildren(currentNode, childrenKey, nextChildren);
      }

      const children = getTreeChildren(currentNode, childrenKey);
      if (children.length === 0) {
        return currentNode;
      }

      let changed = false;
      let nextChildren: TNode[] | undefined;

      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const nextChild = visit(child, {
          parent: currentNode,
          path: [...context.path, index],
          depth: context.depth + 1,
          index,
        });

        if (nextChild !== child) {
          if (!nextChildren) {
            nextChildren = [...children];
          }

          nextChildren[index] = nextChild;
          changed = true;
        }
      }

      if (!changed || !nextChildren) {
        return currentNode;
      }

      return cloneNodeWithChildren(currentNode, childrenKey, nextChildren);
    } finally {
      visiting.delete(currentNode as object);
    }
  }

  return visit(tree as TNode, {
    parent: null,
    path: [],
    depth: 0,
    index: 0,
  });
}
