// Converts Bun JUnit XML output to a Markdown summary

import { readFileSync, writeFileSync } from "fs";
import { DOMParser } from "xmldom";

const xml = readFileSync("bun.xml", "utf-8");
const doc = new DOMParser().parseFromString(xml, "application/xml");

const suites = Array.from(doc.getElementsByTagName("testsuite"));

let md = `# Bun Test Results

| Test Suite | Status | Passed | Failed | Skipped |
|------------|--------|--------|--------|---------|
`;

let totalPassed = 0;
let totalFailed = 0;
let totalSkipped = 0;

for (const suite of suites) {
  const name = suite.getAttribute("name") ?? "Unnamed Suite";
  const tests = Number(suite.getAttribute("tests") ?? 0);
  const failures = Number(suite.getAttribute("failures") ?? 0);
  const skipped = Number(suite.getAttribute("skipped") ?? 0);
  const passed = tests - failures - skipped;

  totalPassed += passed;
  totalFailed += failures;
  totalSkipped += skipped;

  md += `| ${name} | ${failures > 0 ? "❌" : "✅"} | ${passed} | ${failures} | ${skipped} |
`;
}

md += `

**Total:** ${totalPassed} passed, ${totalFailed} failed, ${totalSkipped} skipped
`;

writeFileSync("test-dashboard.md", md);
