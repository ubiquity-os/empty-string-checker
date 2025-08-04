import esbuild, { BuildOptions } from "esbuild";

const baseOptions: BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "node",
  target: "node20",
  outdir: "dist",
  external: ["@typescript-eslint/utils", "@typescript-eslint/parser", "eslint", "typescript"],
};

const cjsOptions: BuildOptions = {
  ...baseOptions,
  format: "cjs",
  outExtension: { ".js": ".cjs" },
};

const esmOptions: BuildOptions = {
  ...baseOptions,
  format: "esm",
  outExtension: { ".js": ".js" },
};

async function runBuild() {
  try {
    await esbuild.build(cjsOptions);
    await esbuild.build(esmOptions);
    console.log("\tesbuild complete");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

void runBuild();
