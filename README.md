# Empty String Checker (ESLint Rule)

This repository provides an ESLint rule that disallows empty string literals in runtime/value contexts for TypeScript and JSX/TSX. The rule integrates directly into your ESLint setup.

## Installation

Ensure you have ESLint and the TypeScript ESLint parser/utilities installed. With Bun:

```bash
bun add -d eslint @typescript-eslint/parser @typescript-eslint/utils typescript
```

Then add this repository's plugin/rule to your project as appropriate (publish or local path depending on your workflow).

## Usage

Extend your ESLint configuration to include the rule. Example (flat config):

```typescript
// eslint.config.mjs
import tsEslint from "typescript-eslint";
import plugin from "./rules/index.js"; // or your published package entry

export default tsEslint.config([
  {
    plugins: {
      "ubiquity-os": plugin,
    },
    rules: {
      "ubiquity-os/no-empty-strings": [
        "warn",
        {
          checkWhitespaceOnly: false,
          checkNoSubstitutionTemplates: true,
          ignoreZeroWidth: false,
          allowContexts: [],
        },
      ],
    },
  },
]);
```

Rule key: `ubiquity-os/no-empty-strings`

## Options

All options are optional. Defaults shown.

- `checkWhitespaceOnly` (boolean, default `false`)

  - When `true`, whitespace-only strings (e.g., `"   "`) are also reported.

- `checkNoSubstitutionTemplates` (boolean, default `true`)

  - When `true`, empty no-substitution template literals (``````) are reported.

- `ignoreZeroWidth` (boolean, default `false`)

  - When `true`, strings consisting only of zero-width characters (e.g., `\u200B`, `\u200C`, `\u200D`, `\u200E`, `\u200F`, `\uFEFF`) are ignored.

- `allowContexts` (string[], default `[]`)
  - Array of AST node types in whose context empty strings should be allowed. Any ancestor node type matching an entry will allow the empty string.

Notes:

- Type-only positions (e.g., `type A = ""`) and import/export specifiers are not reported.
- JSX attribute expressions like `<Comp title={expr} />` are not reported; string literal attributes like `<Comp title="" />` are reported.

## Examples

Valid:

```ts
const a = "x";
const a = `${x}`;
type A = "";
<Comp title={expr} />
```

Invalid:

```ts
const a = "";
const a = myString ?? '';
const a = myString ? myString : '';
const a = ``; // when checkNoSubstitutionTemplates: true
<Comp title=""/>
```

With `checkWhitespaceOnly: true`:

```ts
const a = "   "; // invalid
```

## Development

### Prerequisites

- Bun
- TypeScript

### Install dependencies

```bash
bun install
```

### Run tests

```bash
bun test
```

This runs the ESLint RuleTester-based tests in `tests/empty-string-eslint-rule.test.ts`.

### Lint and format

```bash
bun run format
```
