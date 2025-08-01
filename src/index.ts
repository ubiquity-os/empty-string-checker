import emptyStringRule from "./empty-string-checker";

/**
 * ESLint plugin export under the namespace "ubiquity-os"
 * Consumers will use rule key: "ubiquity-os/empty-string-checker"
 */
const plugin = {
  rules: {
    "empty-string-checker": emptyStringRule,
  },
};

export default plugin;
