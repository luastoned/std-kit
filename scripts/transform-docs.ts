import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import ts from 'typescript';

interface TypeDocText {
  kind: string;
  text: string;
}

interface TypeDocCommentTag {
  tag: string;
  name?: string;
  content?: TypeDocText[];
}

interface TypeDocComment {
  summary?: TypeDocText[];
  blockTags?: TypeDocCommentTag[];
}

interface TypeDocSource {
  fileName: string;
  line: number;
  character: number;
}

interface TypeDocNode {
  id?: number;
  name: string;
  kind: number;
  flags?: Record<string, boolean>;
  comment?: TypeDocComment;
  children?: TypeDocNode[];
  signatures?: TypeDocNode[];
  parameters?: TypeDocNode[];
  typeParameters?: TypeDocNode[];
  type?: TypeDocType;
  default?: TypeDocType;
  defaultValue?: string;
  sources?: TypeDocSource[];
}

interface TypeDocReflectionType {
  type: 'reflection';
  declaration?: {
    signatures?: TypeDocNode[];
    children?: TypeDocNode[];
  };
}

interface TypeDocReferenceType {
  type: 'reference';
  name: string;
  typeArguments?: TypeDocType[];
}

interface TypeDocArrayType {
  type: 'array';
  elementType: TypeDocType;
}

interface TypeDocTypeOperatorType {
  type: 'typeOperator';
  operator: string;
  target: TypeDocType;
}

interface TypeDocUnionType {
  type: 'union';
  types: TypeDocType[];
}

interface TypeDocIntersectionType {
  type: 'intersection';
  types: TypeDocType[];
}

interface TypeDocLiteralType {
  type: 'literal';
  value: string | number | boolean | null | { value: string; negative: boolean };
}

interface TypeDocIntrinsicType {
  type: 'intrinsic';
  name: string;
}

interface TypeDocTupleType {
  type: 'tuple';
  elements: TypeDocType[];
}

interface TypeDocIndexedAccessType {
  type: 'indexedAccess';
  objectType: TypeDocType;
  indexType: TypeDocType;
}

interface TypeDocTypeParameterType {
  type: 'typeParameter';
  name: string;
}

interface TypeDocQueryType {
  type: 'query';
  queryType: TypeDocType;
}

interface TypeDocPredicateType {
  type: 'predicate';
  name: string;
  targetType?: TypeDocType;
  asserts?: boolean;
}

interface TypeDocConditionalType {
  type: 'conditional';
  checkType: TypeDocType;
  extendsType: TypeDocType;
  trueType: TypeDocType;
  falseType: TypeDocType;
}

interface TypeDocMappedType {
  type: 'mapped';
  parameter: string;
  parameterType: TypeDocType;
  templateType: TypeDocType;
  nameType?: TypeDocType;
  readonlyModifier?: '+' | '-';
  optionalModifier?: '+' | '-';
}

interface TypeDocInferredType {
  type: 'inferred';
  name: string;
  constraint?: TypeDocType;
}

interface TypeDocUnknownType {
  type: string;
  [key: string]: unknown;
}

type TypeDocType =
  | TypeDocReflectionType
  | TypeDocReferenceType
  | TypeDocArrayType
  | TypeDocTypeOperatorType
  | TypeDocUnionType
  | TypeDocIntersectionType
  | TypeDocLiteralType
  | TypeDocIntrinsicType
  | TypeDocTupleType
  | TypeDocIndexedAccessType
  | TypeDocTypeParameterType
  | TypeDocQueryType
  | TypeDocPredicateType
  | TypeDocConditionalType
  | TypeDocMappedType
  | TypeDocInferredType
  | TypeDocUnknownType;

interface ItemInfo {
  name: string;
  signature: string;
  comment?: TypeDocComment;
  deprecated?: boolean;
  isType?: boolean;
}

const docsPath = join(process.cwd(), 'docs/documentation.json');
const documentation = JSON.parse(readFileSync(docsPath, 'utf-8')) as TypeDocNode;
const sourceFiles = new Map<string, ts.SourceFile>();

const isTypeDocType = (value: unknown): value is TypeDocType =>
  typeof value === 'object' && value !== null && 'type' in value && typeof (value as { type: unknown }).type === 'string';

const extractCommentText = (items?: TypeDocText[]): string => {
  if (!items || items.length === 0) return '';
  return items
    .map((item) => item.text)
    .join('')
    .trim();
};

const getReflectionSignature = (node: TypeDocNode): TypeDocNode | undefined => {
  if (!node.type || node.type.type !== 'reflection') {
    return undefined;
  }
  return node.type.declaration?.signatures?.[0];
};

function buildTypeString(type?: TypeDocType): string {
  if (!type) return 'unknown';

  switch (type.type) {
    case 'intrinsic':
      return type.name;
    case 'reference': {
      if (type.name === 'KeySelector' && type.typeArguments?.length === 2) {
        const [itemType, keyType] = type.typeArguments;
        return `${buildTypeString(keyType)} | ((item: ${buildTypeString(itemType)}) => ${buildTypeString(keyType)})`;
      }

      const typeArgs = type.typeArguments?.map((arg) => buildTypeString(arg)).join(', ');
      return typeArgs ? `${type.name}<${typeArgs}>` : type.name;
    }
    case 'array': {
      const element = buildTypeString(type.elementType);
      return `${type.elementType.type === 'union' || type.elementType.type === 'intersection' || type.elementType.type === 'conditional' ? `(${element})` : element}[]`;
    }
    case 'typeOperator':
      return `${type.operator} ${buildTypeString(type.target)}`;
    case 'union':
      return type.types.map((inner) => buildTypeString(inner)).join(' | ');
    case 'intersection':
      return type.types.map((inner) => (inner.type === 'conditional' ? `(${buildTypeString(inner)})` : buildTypeString(inner))).join(' & ');
    case 'literal':
      if (typeof type.value === 'object' && type.value !== null) {
        return `${type.value.negative ? '-' : ''}${type.value.value}n`;
      }
      return typeof type.value === 'string' ? `"${type.value}"` : String(type.value);
    case 'tuple':
      return `[${type.elements.map((element) => buildTypeString(element)).join(', ')}]`;
    case 'indexedAccess':
      return `${buildTypeString(type.objectType)}[${buildTypeString(type.indexType)}]`;
    case 'typeParameter':
      return type.name;
    case 'query':
      return `typeof ${buildTypeString(type.queryType)}`;
    case 'predicate': {
      const targetType = type.targetType ? ` is ${buildTypeString(type.targetType)}` : '';
      return type.asserts ? `asserts ${type.name}${targetType}` : `${type.name}${targetType}`;
    }
    case 'conditional':
      return `${buildTypeString(type.checkType)} extends ${buildTypeString(type.extendsType)} ? ${buildTypeString(type.trueType)} : ${buildTypeString(type.falseType)}`;
    case 'mapped': {
      const readonlyModifier = type.readonlyModifier === '+' ? 'readonly ' : type.readonlyModifier === '-' ? '-readonly ' : '';
      const optionalModifier = type.optionalModifier === '+' ? '?' : type.optionalModifier === '-' ? '-?' : '';
      const nameType = type.nameType ? ` as ${buildTypeString(type.nameType)}` : '';
      return `{ ${readonlyModifier}[${type.parameter} in ${buildTypeString(type.parameterType)}${nameType}]${optionalModifier}: ${buildTypeString(type.templateType)} }`;
    }
    case 'inferred':
      return `infer ${type.name}${type.constraint ? ` extends ${buildTypeString(type.constraint)}` : ''}`;
    case 'reflection': {
      const reflectionSig = type.declaration?.signatures?.[0];
      if (reflectionSig) {
        const params = buildParameters(reflectionSig.parameters);
        const returnType = buildTypeString(reflectionSig.type);
        return `(${params}) => ${returnType}`;
      }
      const members = type.declaration?.children?.map((member) => buildInterfaceMember(member));
      if (members && members.length > 0) {
        return `{ ${members.join('; ')} }`;
      }
      return 'object';
    }
    default:
      return 'unknown';
  }
}

const buildTypeParameters = (typeParameters?: TypeDocNode[]): string => {
  if (!typeParameters || typeParameters.length === 0) {
    return '';
  }

  const rendered = typeParameters
    .map((tp) => {
      const constraint = tp.type && isTypeDocType(tp.type) ? ` extends ${buildTypeString(tp.type)}` : '';
      const defaultType = tp.default && isTypeDocType(tp.default) ? ` = ${buildTypeString(tp.default)}` : '';
      return `${tp.name}${constraint}${defaultType}`;
    })
    .join(', ');

  return rendered ? `<${rendered}>` : '';
};

function buildInterfaceMember(member: TypeDocNode): string {
  const readonlyPrefix = member.flags?.isReadonly ? 'readonly ' : '';
  const optionalSuffix = member.flags?.isOptional ? '?' : '';
  const signature = member.signatures?.[0];
  if (signature) {
    return buildSignatureFromNode(`${readonlyPrefix}${member.name}${optionalSuffix}`, signature);
  }

  return `${readonlyPrefix}${member.name}${optionalSuffix}: ${buildTypeString(member.type)}`;
}

const buildParameters = (parameters?: TypeDocNode[]): string => {
  if (!parameters || parameters.length === 0) {
    return '';
  }

  return parameters
    .map((param) => {
      const restPrefix = param.flags?.isRest ? '...' : '';
      const optionalSuffix = param.flags?.isOptional ? '?' : '';
      const typeString = buildTypeString(param.type);
      const defaultValue = param.defaultValue !== undefined ? ` = ${param.defaultValue}` : '';
      return `${restPrefix}${param.name}${optionalSuffix}: ${typeString}${defaultValue}`;
    })
    .join(', ');
};

function buildSignatureFromNode(name: string, signature: TypeDocNode): string {
  const typeParamStr = buildTypeParameters(signature.typeParameters);
  const params = buildParameters(signature.parameters);
  const returnType = buildTypeString(signature.type);
  return `${name}${typeParamStr}(${params}): ${returnType}`;
}

function buildFunctionSignature(func: TypeDocNode): string {
  if (func.kind === 32) {
    const reflectionSig = getReflectionSignature(func);
    if (reflectionSig) {
      return buildSignatureFromNode(func.name, reflectionSig);
    }
  }

  if (func.signatures && func.signatures.length > 0) {
    return func.signatures.map((signature) => buildSignatureFromNode(func.name, signature)).join('\n');
  }

  return func.name;
}

function buildInterfaceSignature(interfaceNode: TypeDocNode): string {
  const typeParamStr = buildTypeParameters(interfaceNode.typeParameters);
  const members = interfaceNode.children?.map((member) => `  ${buildInterfaceMember(member)};`).join('\n') ?? '';
  return `interface ${interfaceNode.name}${typeParamStr} {${members ? `\n${members}\n` : ''}}`;
}

function buildTypeAliasSignature(typeAlias: TypeDocNode): string {
  const typeParamStr = buildTypeParameters(typeAlias.typeParameters);
  const typeStr = buildTypeString(typeAlias.type);
  return `type ${typeAlias.name}${typeParamStr} = ${typeStr}`;
}

function getTypeAliasSource(typeAlias: TypeDocNode): string | undefined {
  const source = getSourceInfo(typeAlias);
  if (!source?.fileName) return undefined;

  const sourcePath = join(process.cwd(), 'src', source.fileName.replace(/^src\//, ''));
  let sourceFile = sourceFiles.get(sourcePath);
  if (!sourceFile) {
    sourceFile = ts.createSourceFile(sourcePath, readFileSync(sourcePath, 'utf-8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    sourceFiles.set(sourcePath, sourceFile);
  }

  const declaration = sourceFile.statements.find((statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === typeAlias.name);
  return declaration
    ?.getText(sourceFile)
    .replace(/^export\s+/, '')
    .replace(/;$/, '');
}

const getBestComment = (node: TypeDocNode): TypeDocComment | undefined => {
  if (node.comment) return node.comment;
  if (node.signatures?.[0]?.comment) return node.signatures[0].comment;
  const reflectionSig = getReflectionSignature(node);
  if (reflectionSig?.comment) return reflectionSig.comment;
  return undefined;
};

const getSourceInfo = (node: TypeDocNode): TypeDocSource | undefined => {
  if (node.sources?.[0]) return node.sources[0];
  if (node.signatures?.[0]?.sources?.[0]) return node.signatures[0].sources[0];
  const reflectionSig = getReflectionSignature(node);
  if (reflectionSig?.sources?.[0]) return reflectionSig.sources[0];
  return undefined;
};

function generateMarkdown(moduleName: string, items: ItemInfo[]): string {
  let markdown = `# ${moduleName}\n\n`;
  markdown += `[← Back to std-kit](../../README.md)\n\n`;
  markdown += '---\n\n';

  const functions = items.filter((item) => !item.isType);
  const types = items.filter((item) => item.isType);

  if (functions.length > 0) {
    markdown += '## Functions\n\n';
    for (const func of functions) {
      const deprecatedTag = func.deprecated ? ' ~~(deprecated)~~' : '';
      markdown += `- \`${func.signature.split('\n')[0]?.replace(/ \{$/, '')}\`${deprecatedTag}\n`;
    }
    markdown += '\n';
  }

  if (types.length > 0) {
    markdown += '## Types\n\n';
    for (const type of types) {
      const deprecatedTag = type.deprecated ? ' ~~(deprecated)~~' : '';
      markdown += `- \`${type.signature.split('\n')[0]?.replace(/ \{$/, '')}\`${deprecatedTag}\n`;
    }
    markdown += '\n';
  }

  markdown += '---\n\n';

  for (const item of items) {
    markdown += `## ${item.name}\n\n`;
    markdown += `\`\`\`typescript\n${item.signature}\n\`\`\`\n\n`;

    if (item.comment) {
      const summary = extractCommentText(item.comment.summary);
      if (summary) {
        markdown += `${summary}\n\n`;
      }

      if (item.comment.blockTags && item.comment.blockTags.length > 0) {
        for (const tag of item.comment.blockTags) {
          const tagName = tag.tag.replace('@', '');
          const content = extractCommentText(tag.content);

          if (tagName === 'deprecated') {
            markdown += `> **Deprecated:** ${content}\n\n`;
          } else if (tagName === 'param') {
            markdown += `- **${tag.name}**: ${content}\n`;
          } else if (tagName === 'returns') {
            markdown += `\n**Returns:** ${content}\n\n`;
          } else if (tagName === 'throws') {
            markdown += `\n**Throws:** ${content}\n\n`;
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

function processModules(): void {
  if (!documentation.children) {
    console.error('No modules found in documentation');
    return;
  }

  const hasModuleWrappers = documentation.children.some((child) => child.kind === 2);
  const declarations = hasModuleWrappers
    ? documentation.children.filter((child) => child.kind === 2).flatMap((moduleNode) => moduleNode.children ?? [])
    : documentation.children;

  const itemsByFile = new Map<string, ItemInfo[]>();

  for (const child of declarations) {
    const isFunction = child.kind === 64 || child.kind === 32;
    const isTypeAlias = child.kind === 2097152;
    const isInterface = child.kind === 256;
    if (!isFunction && !isTypeAlias && !isInterface) continue;

    const source = getSourceInfo(child);
    if (!source?.fileName) continue;

    const signature = isTypeAlias
      ? (getTypeAliasSource(child) ?? buildTypeAliasSignature(child))
      : isInterface
        ? buildInterfaceSignature(child)
        : buildFunctionSignature(child);
    const comment = getBestComment(child);
    const deprecated = comment?.blockTags?.some((tag) => tag.tag === '@deprecated') || false;

    const item: ItemInfo = {
      name: child.name,
      signature,
      comment,
      deprecated,
      isType: isTypeAlias || isInterface,
    };

    if (!itemsByFile.has(source.fileName)) {
      itemsByFile.set(source.fileName, []);
    }

    itemsByFile.get(source.fileName)?.push(item);
  }

  for (const [fileName, items] of itemsByFile.entries()) {
    const filePath = fileName.replace(/^src\//, '').replace(/\.ts$/, '');
    const parts = filePath.split('/');
    if (parts.length !== 2) continue;

    const [category, moduleName] = parts;
    if (category !== 'natives' && category !== 'utilities' && category !== 'structures') {
      continue;
    }
    const markdown = generateMarkdown(moduleName, items);

    const outputDir = join(process.cwd(), 'docs', category);
    const outputPath = join(outputDir, `${moduleName}.md`);

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputPath, markdown, 'utf-8');

    console.log(`Generated: ${outputPath}`);
  }
}

try {
  processModules();
  console.log('Documentation transformation complete!');
} catch (error) {
  console.error('Error transforming documentation:', error);
  process.exit(1);
}
