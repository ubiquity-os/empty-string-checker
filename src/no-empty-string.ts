import type { TSESTree } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";

type Options = [
  {
    checkWhitespaceOnly?: boolean;
    checkNoSubstitutionTemplates?: boolean;
    ignoreZeroWidth?: boolean;
    allowContexts?: string[];
  },
];

type MessageIds = "emptyStringNotAllowed";

const createRule = ESLintUtils.RuleCreator((name) => `https://github.com/ubiquity-os/no-empty-string/docs/rules/${name}`);

function isZeroWidthOnly(text: string): boolean {
  // Common zero-width characters: BOM/ZWNBSP (FEFF), ZWSP (200B), ZWNJ (200C), ZWJ (200D)
  // Also include left-to-right mark (200E) and right-to-left mark (200F)
  // Replace common zero-width characters individually to avoid joined-sequence lint warnings
  const stripped = text
    .replace(/\uFEFF/gu, "")
    .replace(/\u200B/gu, "")
    .replace(/\u200C/gu, "")
    .replace(/\u200D/gu, "")
    .replace(/\u200E/gu, "")
    .replace(/\u200F/gu, "");
  return stripped.length === 0;
}

function isWhitespaceOnly(text: string): boolean {
  return text.trim().length === 0;
}

function isTypePosition(node: TSESTree.Node | null): boolean {
  while (node) {
    if (
      node.type === "TSTypeAnnotation" ||
      node.type === "TSTypeAliasDeclaration" ||
      node.type === "TSLiteralType" ||
      node.type === "TSTypeReference" ||
      node.type === "TSInterfaceDeclaration" ||
      node.type === "TSPropertySignature"
    ) {
      return true;
    }
    node = node.parent ?? null;
  }
  return false;
}

function isImportOrExportSpecifier(node: TSESTree.Node | null): boolean {
  while (node) {
    if (
      node.type === "ImportDeclaration" ||
      node.type === "ExportAllDeclaration" ||
      node.type === "ExportNamedDeclaration" ||
      node.type === "ImportExpression"
    ) {
      return true;
    }
    node = node.parent ?? null;
  }
  return false;
}

function shouldSkipByAllowedContexts(node: TSESTree.Node, allowContexts: string[] | undefined): boolean {
  if (!allowContexts || allowContexts.length === 0) {
    return false;
  }
  let cursor: TSESTree.Node | null = node;
  while (cursor) {
    if (allowContexts.indexOf(cursor.type) !== -1) {
      return true;
    }
    cursor = cursor.parent ?? null;
  }
  return false;
}

const rule = createRule<Options, MessageIds>({
  name: "no-empty-string",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow empty string literals in runtime/value contexts",
    },
    messages: {
      emptyStringNotAllowed: "Empty string literal is not allowed.",
    },
    schema: [
      {
        type: "object",
        properties: {
          checkWhitespaceOnly: { type: "boolean" },
          checkNoSubstitutionTemplates: { type: "boolean" },
          ignoreZeroWidth: { type: "boolean" },
          allowContexts: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      checkWhitespaceOnly: false,
      checkNoSubstitutionTemplates: true,
      ignoreZeroWidth: false,
      allowContexts: [],
    },
  ],
  create: function create(context, [options]) {
    function reportIfEmpty(text: string, node: TSESTree.Node): void {
      if (shouldSkipByAllowedContexts(node, options.allowContexts)) {
        return;
      }
      if (isTypePosition(node) || isImportOrExportSpecifier(node)) {
        return;
      }

      const value = text;

      if (options.ignoreZeroWidth === true && isZeroWidthOnly(value)) {
        return;
      }

      if (value.length === 0) {
        context.report({ node, messageId: "emptyStringNotAllowed" });
        return;
      }

      if (options.checkWhitespaceOnly && isWhitespaceOnly(value)) {
        context.report({ node, messageId: "emptyStringNotAllowed" });
      }
    }

    return {
      Literal: function onLiteral(node: TSESTree.Literal) {
        if (typeof node.value !== "string") {
          return;
        }
        if (node.parent && node.parent.type === "JSXAttribute") {
          return;
        }
        reportIfEmpty(String(node.value), node);
      },

      TemplateLiteral: function onTemplateLiteral(node: TSESTree.TemplateLiteral) {
        // Ignore templates with expressions; they are dynamic values
        if (node.expressions && node.expressions.length > 0) {
          return;
        }
        // NoSubstitutionTemplateLiteral equivalent: exactly one quasi
        if (!options.checkNoSubstitutionTemplates) {
          return;
        }
        const quasis = node.quasis ?? [];
        if (quasis.length !== 1) {
          return;
        }
        const first = quasis[0];
        const cooked = first?.value?.cooked ?? "";
        reportIfEmpty(cooked, node);
      },

      JSXAttribute: function onJsxAttribute(node: TSESTree.JSXAttribute) {
        if (!node.value) {
          return;
        }
        if (node.value.type === "Literal" && typeof (node.value as TSESTree.Literal).value === "string") {
          reportIfEmpty(String((node.value as TSESTree.Literal).value), node.value);
        }
      },
    };
  },
});

export default rule;
