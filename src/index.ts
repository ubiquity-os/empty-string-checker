import emptyStringRule from "./no-empty-strings";

/**
 * ESLint plugin export under the namespace "ubiquity-os"
 * Consumers will use rule key: "ubiquity-os/no-empty-strings"
 */
const plugin = {
  rules: {
    "no-empty-strings": emptyStringRule,
  },
};

export default plugin;
