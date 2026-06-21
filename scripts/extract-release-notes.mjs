#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const [version, outputPath] = process.argv.slice(2);

if (!version || !outputPath) {
  console.error("Usage: node scripts/extract-release-notes.mjs <version> <output-file>");
  process.exit(1);
}

const changelogPath = process.env.CHANGELOG_PATH || "CHANGELOG.md";
const changelog = await readFile(changelogPath, "utf8");
const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const headingPattern = new RegExp(`^##\\s+(?:\\[)?v?${escapedVersion}(?:\\])?(?:\\s+-\\s+.*)?\\s*$`, "m");
const heading = headingPattern.exec(changelog);

if (!heading || heading.index === undefined) {
  console.error(`Could not find CHANGELOG.md section for version ${version}.`);
  console.error(`Expected a heading like "## ${version} - YYYY-MM-DD".`);
  process.exit(1);
}

const notesStart = heading.index + heading[0].length;
const nextHeadingIndex = changelog.slice(notesStart).search(/\n##\s+/);
const notesEnd = nextHeadingIndex === -1 ? changelog.length : notesStart + nextHeadingIndex;
const notes = changelog.slice(notesStart, notesEnd).trim();

if (!notes) {
  console.error(`CHANGELOG.md section for version ${version} is empty.`);
  process.exit(1);
}

await writeFile(outputPath, `${notes}\n`, "utf8");
