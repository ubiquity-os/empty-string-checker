import { RuleTester } from "eslint";
import rule from "../rules/empty-string-checker";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("ubiquity-os/empty-string-checker", rule as never, {
  valid: [{ code: 'const a = "x";' }, { code: "const a = `${x}`;" }, { code: 'type A = "";' }, { code: "<Comp title={expr} />", filename: "src/sample.tsx" }],
  invalid: [
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
