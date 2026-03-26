export interface Tree {
  id: string;
  children: Tree[];
  [key: string]: any
}

export const addNode = (node: Tree, targetId: string, newNode: Tree): Tree => {
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

export const updateNode = (node: Tree, targetId: string, updates: Partial<Omit<Tree, "id">>): Tree => {
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

export const deleteNode = (node: Tree, targetId: string): Tree | null => {
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
    .filter((child): child is Tree => child !== null);

  if (updatedChildren.length !== node.children.length) {
    changed = true;
  }

  return changed ? { ...node, children: updatedChildren } : node;
}