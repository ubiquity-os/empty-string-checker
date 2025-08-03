import esbuild, { BuildOptions } from "esbuild";

export const esbuildOptions: BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outdir: "dist",
  external: ["@typescript-eslint/utils", "@typescript-eslint/parser", "eslint", "typescript"],
};

async function runBuild() {
  try {
    await esbuild.build(esbuildOptions);
    console.log("\tesbuild complete");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

void runBuild();
