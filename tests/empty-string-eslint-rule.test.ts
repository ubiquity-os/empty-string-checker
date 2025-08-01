import { RuleTester } from "eslint";
import rule from "../src/empty-string-checker";

import tsParser from "@typescript-eslint/parser";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parser: tsParser as unknown as import("eslint").Linter.Parser,
    parserOptions: {
      ecmaFeatures: { jsx: true },
      project: false,
    },
  },
});

tester.run("ubiquity-os/empty-string-checker", rule as never, {
  valid: [
    { code: 'const a = "x";' },
    { code: "const a = `${x}`;" },
    { code: 'type A = "";', filename: "src/sample.ts" },
    { code: "<Comp title={expr} />", filename: "src/sample.tsx" },
  ],
  invalid: [
    {
      code: "const a = myString ?? '';",
      errors: [{ messageId: "emptyStringNotAllowed" }],
    },
    {
      code: "const a = myString ? myString : '';",
      errors: [{ messageId: "emptyStringNotAllowed" }],
    },
    {
      code: 'const a = "";',
      errors: [{ messageId: "emptyStringNotAllowed" }],
    },
    {
      code: "const a = ``;",
      options: [{ checkNoSubstitutionTemplates: true }],
      errors: [{ messageId: "emptyStringNotAllowed" }],
    },
    {
      code: 'const a = "   ";',
      options: [{ checkWhitespaceOnly: true }],
      errors: [{ messageId: "emptyStringNotAllowed" }],
    },
    {
      code: '<Comp title=""/>',
      filename: "src/sample.tsx",
      errors: [{ messageId: "emptyStringNotAllowed" }],
    },
  ],
});
