/**
 * Represents a node in a tree structure.
 * Each node has a unique identifier and a list of child nodes.
 */
export interface TreeNode {
  id: string;
  children: TreeNode[];
  [key: string]: any
}

/**
 * Adds a new child node to the node with the given targetId.
 *
 * Traverses the tree recursively and returns a new tree with the child added.
 * If the target node is not found, the original tree is returned unchanged.
 *
 * @param node - The current node being traversed (typically the root node).
 * @param targetId - The id of the node to which the new child should be added.
 * @param newChild - The new node to append to the target node's children.
 *
 * @returns A new TreeNode with the child added, or the original node if no match was found.
 */
export const addNode = (node: TreeNode, targetId: string, newNode: TreeNode): TreeNode => {
  if (node.id === targetId) {
    return {
      ...node,
      children: [...node.children, newNode],
    };
  }

  let changed = false;

  const updatedChildren = node.children.map(child => {
    const result = addNode(child, targetId, newNode);

    if (result !== child) {
      changed = true;
    }

    return result;
  });

  return changed ? { ...node, children: updatedChildren } : node;
}

/**
 * Updates properties of a node identified by targetId.
 *
 * Traverses the tree recursively and merges the provided updates into the matching node.
 * The node's `id` is not modified.
 *
 * If the target node is not found, the original tree is returned unchanged.
 *
 * @param node - The current node being traversed (typically the root node).
 * @param targetId - The id of the node to update.
 * @param updates - Partial set of properties to merge into the target node.
 *
 * @returns A new TreeNode with the updates applied, or the original node if no match was found.
 */
export const updateNode = (node: TreeNode, targetId: string, updates: Partial<Omit<TreeNode, "id">>): TreeNode => {
  if (node.id === targetId) {
    return {
      ...node,
      ...updates,
    };
  }

  let changed = false;

  const updatedChildren = node.children.map(child => {
    const result = updateNode(child, targetId, updates);

    if (result !== child) {
      changed = true;
    }

    return result;
  });

  return changed ? { ...node, children: updatedChildren } : node;
}

/**
 * Removes a node identified by targetId from the tree.
 *
 * Traverses the tree recursively and removes the matching node.
 * If the root node matches the targetId, null is returned.
 *
 * If the target node is not found, the original tree is returned unchanged.
 *
 * @param node - The current node being traversed (typically the root node).
 * @param targetId - The id of the node to remove.
 *
 * @returns A new TreeNode with the node removed, the original node if not found,
 *          or null if the root node itself is deleted.
 */
export const deleteNode = (node: TreeNode, targetId: string): TreeNode | null => {
  if (node.id === targetId) {
    return null;
  }

  let changed = false;

  const updatedChildren = node.children
    .map(child => {
      const result = deleteNode(child, targetId);

      if (result !== child) {
        changed = true;
      }

      return result;
    })
    .filter((child): child is TreeNode => child !== null);

  if (updatedChildren.length !== node.children.length) {
    changed = true;
  }

  return changed ? { ...node, children: updatedChildren } : node;
}