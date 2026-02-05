import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

interface TypeDocNode {
  id: number;
  name: string;
  variant: string;
  kind: number;
  flags?: Record<string, boolean>;
  comment?: {
    summary?: Array<{ kind: string; text: string }>;
    blockTags?: Array<{
      tag: string;
      name?: string;
      content: Array<{ kind: string; text: string }>;
    }>;
  };
  children?: TypeDocNode[];
  signatures?: TypeDocNode[];
  parameters?: TypeDocNode[];
  typeParameters?: TypeDocNode[];
  type?: any;
  defaultValue?: string;
  sources?: Array<{ fileName: string; line: number; character: number }>;
}

interface ItemInfo {
  name: string;
  signature: string;
  comment?: TypeDocNode['comment'];
  deprecated?: boolean;
  isType?: boolean;
}

// Read the TypeDoc JSON file
const docsPath = join(process.cwd(), 'docs/documentation.json');
const documentation = JSON.parse(readFileSync(docsPath, 'utf-8')) as TypeDocNode;

// Helper to extract text from comment blocks
function extractCommentText(items?: Array<{ kind: string; text: string }>): string {
  if (!items) return '';
  return items.map((item) => item.text).join('');
}

// Helper to build type string
function buildTypeString(type: any): string {
  if (!type) return 'unknown';

  switch (type.type) {
    case 'intrinsic':
      return type.name;
    case 'reference':
      return type.name;
    case 'array':
      return `${buildTypeString(type.elementType)}[]`;
    case 'typeOperator':
      return `${type.operator} ${buildTypeString(type.target)}`;
    case 'union':
      return type.types.map((t: any) => buildTypeString(t)).join(' | ');
    case 'literal':
      return typeof type.value === 'string' ? `"${type.value}"` : String(type.value);
    case 'reflection':
      // For function types
      if (type.declaration?.signatures?.[0]) {
        const sig = type.declaration.signatures[0];
        const params = sig.parameters
          ?.map((p: any) => `${p.name}: ${buildTypeString(p.type)}`)
          .join(', ') || '';
        return `(${params}) => ${buildTypeString(sig.type)}`;
      }
      return 'object';
    default:
      return 'unknown';
  }
}

// Helper to build function signature
function buildFunctionSignature(func: TypeDocNode): string {
  // For const variables that reference other functions
  if (func.kind === 32 && func.type?.declaration?.signatures) {
    const signature = func.type.declaration.signatures[0];
    return buildSignatureFromNode(func.name, signature);
  }

  // For regular functions
  if (func.signatures && func.signatures.length > 0) {
    return buildSignatureFromNode(func.name, func.signatures[0]);
  }

  return func.name;
}

function buildSignatureFromNode(name: string, signature: TypeDocNode): string {
  const typeParams = signature.typeParameters
    ?.map((tp: any) => {
      if (tp.default) {
        return `${tp.name} = ${buildTypeString(tp.default)}`;
      }
      return tp.name;
    })
    .join(', ');

  const params = signature.parameters
    ?.map((p: any) => {
      const paramType = buildTypeString(p.type);
      const defaultValue = p.defaultValue !== undefined ? ` = ${p.defaultValue}` : '';
      return `${p.name}: ${paramType}${defaultValue}`;
    })
    .join(', ');

  const returnType = buildTypeString(signature.type);
  const typeParamStr = typeParams ? `<${typeParams}>` : '';

  return `${name}${typeParamStr}(${params || ''}): ${returnType}`;
}

// Helper to build type alias signature
function buildTypeAliasSignature(typeAlias: TypeDocNode): string {
  const typeParams = typeAlias.typeParameters
    ?.map((tp: any) => {
      if (tp.default) {
        return `${tp.name} = ${buildTypeString(tp.default)}`;
      }
      return tp.name;
    })
    .join(', ');

  const typeParamStr = typeParams ? `<${typeParams}>` : '';
  const typeStr = buildTypeString(typeAlias.type);

  return `type ${typeAlias.name}${typeParamStr} = ${typeStr}`;
}

// Extract function information from a module
function extractFunctions(module: TypeDocNode): ItemInfo[] {
  if (!module.children) return [];

  return module.children
    .filter((child) => child.kind === 64 || child.kind === 32) // Functions or const variables
    .map((func) => {
      const signature = buildFunctionSignature(func);

      // Get comment from function or its first signature
      let comment = func.comment;
      if (!comment && func.signatures?.[0]) {
        comment = func.signatures[0].comment;
      }
      if (!comment && func.type?.declaration?.signatures?.[0]) {
        comment = func.type.declaration.signatures[0].comment;
      }

      // Check if deprecated
      const deprecated = comment?.blockTags?.some((tag) => tag.tag === '@deprecated') || false;

      return {
        name: func.name,
        signature,
        comment,
        deprecated,
      };
    });
}

// Generate markdown for a module
function generateMarkdown(moduleName: string, functions: ItemInfo[]): string {
  let markdown = `# ${moduleName}\n\n`;
  markdown += `[← Back to std-kit](../../README.md)\n\n`;
  markdown += '---\n\n';

  // Separate functions and types
  const funcs = functions.filter((f) => !f.isType);
  const types = functions.filter((f) => f.isType);

  // Header section with all signatures
  if (funcs.length > 0) {
    markdown += '## Functions\n\n';
    for (const func of funcs) {
      const deprecatedTag = func.deprecated ? ' ~~(deprecated)~~' : '';
      markdown += `- \`${func.signature}\`${deprecatedTag}\n`;
    }
    markdown += '\n';
  }

  if (types.length > 0) {
    markdown += '## Types\n\n';
    for (const type of types) {
      const deprecatedTag = type.deprecated ? ' ~~(deprecated)~~' : '';
      markdown += `- \`${type.signature}\`${deprecatedTag}\n`;
    }
    markdown += '\n';
  }

  markdown += '---\n\n';

  // Body section with detailed documentation
  for (const func of functions) {
    markdown += `## ${func.name}\n\n`;
    markdown += `\`\`\`typescript\n${func.signature}\n\`\`\`\n\n`;

    if (func.comment) {
      // Summary
      if (func.comment.summary) {
        const summary = extractCommentText(func.comment.summary);
        if (summary) {
          markdown += `${summary}\n\n`;
        }
      }

      // Block tags
      if (func.comment.blockTags) {
        for (const tag of func.comment.blockTags) {
          const tagName = tag.tag.replace('@', '');
          const content = extractCommentText(tag.content);

          if (tagName === 'deprecated') {
            markdown += `> **Deprecated:** ${content}\n\n`;
          } else if (tagName === 'param') {
            markdown += `- **${tag.name}**: ${content}\n`;
          } else if (tagName === 'returns') {
            markdown += `\n**Returns:** ${content}\n\n`;
          } else if (tagName === 'template') {
            markdown += `- **Type Parameter ${tag.name}**: ${content}\n`;
          }
        }
        markdown += '\n';
      }
    }

    markdown += '---\n\n';
  }

  return markdown;
}

// Process all modules
function processModules() {
  if (!documentation.children) {
    console.error('No modules found in documentation');
    return;
  }

  // Get all modules (kind === 2)
  const modules = documentation.children.filter((child) => child.kind === 2);

  // Group functions and types by their source file
  const functionsByFile = new Map<string, ItemInfo[]>();

  for (const module of modules) {
    if (!module.children) continue;

    for (const child of module.children) {
      // Process functions, const variables, and type aliases
      const isFunction = child.kind === 64 || child.kind === 32;
      const isTypeAlias = child.kind === 2097152;

      if (!isFunction && !isTypeAlias) continue;

      // Get the source file name
      const source = child.sources?.[0] || child.signatures?.[0]?.sources?.[0];
      if (!source || !source.fileName) continue;

      const fileName = source.fileName;

      // Build signature
      const signature = isTypeAlias ? buildTypeAliasSignature(child) : buildFunctionSignature(child);

      // Get comment
      let comment = child.comment;
      if (!comment && child.signatures?.[0]) {
        comment = child.signatures[0].comment;
      }
      if (!comment && child.type?.declaration?.signatures?.[0]) {
        comment = child.type.declaration.signatures[0].comment;
      }
      const deprecated = comment?.blockTags?.some((tag) => tag.tag === '@deprecated') || false;

      const itemInfo: ItemInfo = {
        name: child.name,
        signature,
        comment,
        deprecated,
        isType: isTypeAlias,
      };

      // Add to the map
      if (!functionsByFile.has(fileName)) {
        functionsByFile.set(fileName, []);
      }
      functionsByFile.get(fileName)!.push(itemInfo);
    }
  }

  // Generate markdown files for each source file
  for (const [fileName, functions] of functionsByFile.entries()) {
    // Extract module path (e.g., "natives/array.ts" -> ["natives", "array"])
    const filePath = fileName.replace(/\.ts$/, '');
    const parts = filePath.split('/');
    if (parts.length !== 2) continue;

    const [category, moduleName] = parts;

    // Generate markdown
    const markdown = generateMarkdown(moduleName, functions);

    // Write to file
    const outputDir = join(process.cwd(), 'docs', category);
    const outputPath = join(outputDir, `${moduleName}.md`);

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputPath, markdown, 'utf-8');

    console.log(`Generated: ${outputPath}`);
  }
}

// Run the script
try {
  processModules();
  console.log('Documentation transformation complete!');
} catch (error) {
  console.error('Error transforming documentation:', error);
  process.exit(1);
}
