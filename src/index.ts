import emptyStringRule from "./no-empty-string";

/**
 * ESLint plugin export under the namespace "ubiquity-os"
 * Consumers will use rule key: "ubiquity-os/no-empty-string"
 */
const plugin = {
  rules: {
    "no-empty-string": emptyStringRule,
  },
};

export default plugin;
