import { describe, expect, it } from 'vitest';
import { findTreeNode, flattenTree, insertTreeNode, mapTree, queryTree, removeTreeNode, replaceTreeNode, updateTreeNode, walkTree } from './tree';

type ItemTreeNode = {
  id: string;
  label: string;
  children?: ItemTreeNode[];
};

type CustomTreeNode = {
  id: string;
  nodes?: CustomTreeNode[];
};

const sampleTree = (): ItemTreeNode => ({
  id: 'root',
  label: 'Root',
  children: [
    {
      id: 'a',
      label: 'A',
      children: [
        { id: 'a1', label: 'A1' },
        { id: 'a2', label: 'A2' },
      ],
    },
    {
      id: 'b',
      label: 'B',
      children: [{ id: 'b1', label: 'B1' }],
    },
  ],
});

describe('walkTree', () => {
  it('walks a tree in depth-first preorder with context', () => {
    const visited: Array<{ id: string; path: number[]; depth: number; parent: string | null; index: number }> = [];

    walkTree(sampleTree(), (node, context) => {
      visited.push({
        id: node.id,
        path: [...context.path],
        depth: context.depth,
        parent: context.parent?.id ?? null,
        index: context.index,
      });
    });

    expect(visited).toEqual([
      { id: 'root', path: [], depth: 0, parent: null, index: 0 },
      { id: 'a', path: [0], depth: 1, parent: 'root', index: 0 },
      { id: 'a1', path: [0, 0], depth: 2, parent: 'a', index: 0 },
      { id: 'a2', path: [0, 1], depth: 2, parent: 'a', index: 1 },
      { id: 'b', path: [1], depth: 1, parent: 'root', index: 1 },
      { id: 'b1', path: [1, 0], depth: 2, parent: 'b', index: 0 },
    ]);
  });

  it('supports skip and stop control values', () => {
    const visited: string[] = [];

    walkTree(sampleTree(), (node) => {
      visited.push(node.id);
      if (node.id === 'a') {
        return 'skip';
      }

      if (node.id === 'b') {
        return 'stop';
      }

      return;
    });

    expect(visited).toEqual(['root', 'a', 'b']);
  });

  it('defensively avoids infinite recursion for cyclic input', () => {
    const root: ItemTreeNode = { id: 'root', label: 'Root' };
    root.children = [root];

    const visited: string[] = [];
    walkTree(root, (node) => {
      visited.push(node.id);
    });

    expect(visited).toEqual(['root']);
  });
});

describe('findTreeNode', () => {
  it('returns the first matching node in preorder', () => {
    const result = findTreeNode(sampleTree(), (node) => node.id.startsWith('a'));
    expect(result?.id).toBe('a');
  });
});

describe('queryTree', () => {
  it('returns matching nodes and respects maxResults', () => {
    const result = queryTree(sampleTree(), (node) => node.id.includes('1'), { maxResults: 1 });
    expect(result.map((node) => node.id)).toEqual(['a1']);
  });
});

describe('flattenTree', () => {
  it('flattens a tree in preorder', () => {
    const result = flattenTree(sampleTree());
    expect(result.map((node) => node.id)).toEqual(['root', 'a', 'a1', 'a2', 'b', 'b1']);
  });
});

describe('mapTree', () => {
  it('maps every node immutably', () => {
    const tree = sampleTree();
    const result = mapTree(tree, (node) => ({
      ...node,
      label: node.label.toUpperCase(),
    }));

    expect(result.children?.[0]?.label).toBe('A');
    expect(result.children?.[1]?.children?.[0]?.label).toBe('B1');
    expect(result).not.toBe(tree);
    expect(result.children?.[0]).not.toBe(tree.children?.[0]);
  });

  it('supports custom child keys', () => {
    const tree: CustomTreeNode = {
      id: 'root',
      nodes: [{ id: 'a', nodes: [{ id: 'a1' }] }],
    };

    const result = mapTree(
      tree,
      (node) => ({
        ...node,
        id: node.id.toUpperCase(),
      }),
      { childrenKey: 'nodes' },
    );

    expect(result).toEqual({
      id: 'ROOT',
      nodes: [{ id: 'A', nodes: [{ id: 'A1' }] }],
    });
  });
});

describe('updateTreeNode', () => {
  it('updates the first matching node by predicate', () => {
    const tree = sampleTree();
    const result = updateTreeNode(
      tree,
      (node) => node.id.startsWith('a'),
      (node) => ({
        ...node,
        label: `${node.label}!`,
      }),
    );

    expect(result.children?.[0]?.label).toBe('A!');
    expect(result.children?.[0]?.children?.[0]?.label).toBe('A1');
  });

  it('returns the original tree when no node matches', () => {
    const tree = sampleTree();
    const result = updateTreeNode(
      tree,
      (node) => node.id === 'missing',
      (node) => ({
        ...node,
        label: 'Changed',
      }),
    );

    expect(result).toBe(tree);
  });
});

describe('replaceTreeNode', () => {
  it('replaces a node by path', () => {
    const tree = sampleTree();
    const replacement: ItemTreeNode = { id: 'b1x', label: 'B1X' };
    const result = replaceTreeNode(tree, [1, 0], replacement);

    expect(result.children?.[1]?.children?.[0]).toEqual({ id: 'b1x', label: 'B1X' });
  });
});

describe('removeTreeNode', () => {
  it('removes the first matching node', () => {
    const tree = sampleTree();
    const result = removeTreeNode(tree, (node) => node.id === 'a1');

    expect(result?.children?.[0]?.children).toEqual([{ id: 'a2', label: 'A2' }]);
  });

  it('returns undefined when removing the root node', () => {
    const result = removeTreeNode(sampleTree(), []);
    expect(result).toBeUndefined();
  });
});

describe('insertTreeNode', () => {
  it('inserts a node by parent predicate and position', () => {
    const tree = sampleTree();
    const insertedNode: ItemTreeNode = { id: 'a0', label: 'A0' };
    const result = insertTreeNode(tree, (node) => node.id === 'a', insertedNode, { position: 'prepend' });

    expect(result.children?.[0]?.children?.map((node: ItemTreeNode) => node.id)).toEqual(['a0', 'a1', 'a2']);
  });

  it('supports custom child keys during insertion', () => {
    const tree: CustomTreeNode = {
      id: 'root',
      nodes: [{ id: 'a' }],
    };
    const insertedNode: CustomTreeNode = { id: 'b' };

    const result = insertTreeNode(tree, [], insertedNode, { childrenKey: 'nodes', position: 'append' });

    expect(result.nodes?.map((node: CustomTreeNode) => node.id)).toEqual(['a', 'b']);
  });
});
