import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/index.ts"],
  project: ["src/**/*.ts"],
  ignore: ["src/types/config.ts", "**/__mocks__/**", "**/__fixtures__/**", "eslint.config.mjs"],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: [],
  ignoreBinaries: ["commitlint", "publish"],
  eslint: true,
};

export default config;
