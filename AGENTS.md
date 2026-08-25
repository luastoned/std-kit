# Repository Guidance

Use these instructions for all work in this repository. This is a single-package TypeScript library; keep repository-wide and implementation guidance together here.

## Project context

- `std-kit` is a runtime-dependency-free utility library built with strict TypeScript and Yarn 1.
- Support Node.js 20 and newer. Emit ES2022 and preserve both CommonJS and ESM package outputs.
- Keep the main `std-kit` entrypoint in `src/index.ts` browser/universal compatible. Put Node.js-only APIs behind `src/node.ts` and the `std-kit/node` entrypoint.
- Treat `package.json`, `tsconfig*.json`, `tsdown.config.mts`, `vitest.config.ts`, and the package scripts as authoritative for runtime, module, build, and tooling behavior.

## TypeScript principles

- Prefer modern TypeScript, runtime correctness, maintainability, and established repository patterns over personal style.
- Reuse existing modules, utilities, types, and internal helpers before adding another abstraction. Because this repository implements `std-kit`, do not import the published package into its own source.
- Keep changes focused. Add dependencies, indirection, compatibility layers, or optimizations only when the task provides a concrete reason.
- Before changing behavior, check the existing implementation, tests, public export contract, runtime boundary, and generated documentation.
- Prefer the least surprising design that is explicit at boundaries, easy to test, and easy for one maintainer to understand.
- Do not introduce deprecated JavaScript or TypeScript syntax, compiler options, or migration flags.

## Imports and exports

- Let `oxfmt` own import ordering, grouping, quotes, semicolons, and other mechanical formatting.
- Use `node:` specifiers for Node.js built-ins and `import type` for type-only imports.
- Use the configured `~/*` alias for cross-directory source imports. Follow the existing local-import style within one module or directory.
- Do not add file extensions to TypeScript source imports unless the build configuration requires them.
- Prefer named exports. The entrypoints intentionally use barrel exports to define the package API; avoid additional barrels that obscure ownership or introduce cycles.
- Keep universal code free of Node.js-only modules, globals, and types. Export Node.js-specific functionality only from `src/node.ts`.
- When public runtime or type exports change, update the sorted contract in `scripts/public-exports.json`. Preserve matching CJS, ESM, and declaration exports.

## Types and public boundaries

- Do not introduce `any` or `as any` in library code. Use `unknown`, narrow it safely, and isolate unavoidable third-party interop with a short reason.
- Prefer `@ts-expect-error` with a reason over `@ts-ignore` when a type-level test or compatibility boundary needs suppression.
- Give exported functions, public methods, and cross-module APIs explicit return types. Local helpers may rely on inference when the result is obvious.
- Prefer precise generics, literal or discriminated unions, `as const`, and `satisfies` over broad assertions or `enum`.
- Prefer readonly arrays and object shapes at public boundaries unless mutation is part of the documented contract.
- Avoid non-null assertions unless an immediately preceding runtime check proves the value exists.
- Validate values at runtime when TypeScript cannot enforce a public input contract. Make thrown error types and edge-case behavior deliberate and documented.
- Avoid ambient namespaces, global augmentation, declaration merging, and decorators unless the platform requires them.
- Treat exported names and types as versioned API. For a breaking change, update implementation, tests, export contract, TSDoc, and generated documentation together.

## Implementation design

- Prefer named function declarations for exported or shared stateless logic. Use arrow functions for local callbacks and lexical closures.
- Prefer small, single-purpose functions, early returns, and explicit state and error paths.
- Use an options object when an API grows beyond a clear positional signature, especially with three or more parameters or multiple booleans.
- Do not extract a shared helper or base abstraction until a pattern recurs at least three times, unless the surrounding design already establishes that abstraction.
- Use classes only when they clarify ownership of cohesive state or behavior. Avoid class hierarchies and interface-only indirection without multiple real implementations.
- Avoid hidden module-level mutable state. Make ownership and lifecycle explicit when state is necessary.
- Do not swallow errors silently. Preserve relevant context and causes when wrapping errors.
- Prefer `node:fs/promises` over synchronous filesystem APIs in asynchronous scripts.
- Use `AbortSignal`, timeouts, and explicit cancellation for new long-running I/O when the API can support them.
- Write comments for intent, constraints, compatibility, or non-obvious trade-offs. Do not narrate the code, and remove stale comments when behavior changes.
- Add a blank line after a multiline statement before its next sibling statement unless both belong to the same construct.

## Tests and documentation

- Keep Vitest tests beside their source as `*.test.ts`. Add focused tests for normal behavior, boundary values, invalid input, and regression cases.
- For type contracts, use compile-time assertions in tests and keep runtime assertions separate and readable.
- Treat source TSDoc as the API-documentation source. Do not hand-edit generated files under `docs/`; run `yarn docs` and review the generated diff.
- Keep README examples and descriptions aligned with supported entrypoints and current behavior.
- Mark implementation-only declarations with `@internal` when they must remain out of generated public documentation.

## Tooling and validation

- Install dependencies with `yarn install --frozen-lockfile`.
- Run a focused test first with `yarn test <test-path>` when one test file covers the change.
- Run `yarn typecheck`, `yarn lint:check`, and `yarn format:check` through the project scripts; do not invoke `tsc` on individual files.
- Run `yarn verify` for source or test changes. It performs typechecking, linting, formatting checks, and the full test suite.
- Run `yarn release:artifacts` for public API, build configuration, documentation, entrypoint, or packaging changes. It builds, regenerates docs, validates exports, and checks the package tarball.
- Run `yarn release:check` when a change affects release behavior or spans both implementation and artifact concerns.
- If an applicable check cannot run, state exactly what remains unverified.

## Repository and commit discipline

- Keep source, its tests, and tightly coupled API contract or generated documentation changes in the same change boundary.
- Before staging, review all changed paths and separate unrelated work. Stage deletions and moves with their related edits.
- Do not commit dependency folders, build output, coverage, credentials, local-only files, or nested repositories.
- Follow Conventional Commits with the subject format `<type>[optional scope][optional !]: <gitmoji> <description>`.
- Use `!` or a `BREAKING CHANGE:` footer when a commit intentionally breaks the public API.

## Communication and technical writing

- Lead with results and keep responses concise, precise, and proportional to the task.
- Separate verified facts from conclusions, assumptions, and speculation. Support compatibility, performance, and security claims with evidence.
- Write clear technical English for a global audience. Use consistent terminology, active voice where useful, and conditions before dependent actions.
- Use numbered imperative steps for sequential procedures. Use `must` for requirements, `prefer` or `recommend` for defaults, `can` for capability, and `might` for possibility.
- Prefer versions, dates, states, or events over ambiguous time-relative labels such as “new” or “latest.”
