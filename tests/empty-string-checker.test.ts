import { parseDiffForEmptyStrings } from "../.github/scripts/empty-string-checker";

describe("parseDiffForEmptyStrings", () => {
  test("detects empty strings in added TypeScript lines", () => {
    const diff = ["+++ b/src/example.ts", "@@ -1,2 +1,2 @@", '+const foo = "";'].join("\n");
    const result = parseDiffForEmptyStrings(diff);
    expect(result).toEqual([{ file: "src/example.ts", line: 1, content: 'const foo = "";' }]);
  });

  test("ignores empty strings in template literals", () => {
    const diff = ["+++ b/src/example.ts", "@@ -1,2 +1,2 @@", '+const foo = `${""}`;'].join("\n");
    const result = parseDiffForEmptyStrings(diff);
    expect(result).toEqual([]);
  });

  test("ignores non-TypeScript files", () => {
    const diff = ["+++ b/src/example.js", "@@ -1,2 +1,2 @@", '+const foo = "";'].join("\n");
    const result = parseDiffForEmptyStrings(diff);
    expect(result).toEqual([]);
  });

  test("handles multiple violations and lines", () => {
    const diff = ["+++ b/src/example.ts", "@@ -1,3 +1,3 @@", '+const foo = "";', '+const bar = "";', '+const baz = "not empty";'].join("\n");
    const result = parseDiffForEmptyStrings(diff);
    expect(result).toEqual([
      { file: "src/example.ts", line: 1, content: 'const foo = "";' },
      { file: "src/example.ts", line: 2, content: 'const bar = "";' },
    ]);
  });

  test("returns empty array for no violations", () => {
    const diff = ["+++ b/src/example.ts", "@@ -1,2 +1,2 @@", '+const foo = "bar";'].join("\n");
    const result = parseDiffForEmptyStrings(diff);
    expect(result).toEqual([]);
  });
});
