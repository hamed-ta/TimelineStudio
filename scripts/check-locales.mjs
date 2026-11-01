import fs from "node:fs";
import ts from "typescript";

const languages = ["en", "es", "fr", "fa", "ar"];
const catalogs = Object.fromEntries(languages.map(language => [language, JSON.parse(fs.readFileSync(`src/i18n/locales/${language}.json`, "utf8"))]));
const english = catalogs.en;
const pluralKey = /^(years|months|days|items)_(zero|one|two|few|many|other)$/;
const variables = value => [...value.matchAll(/{{(\w+)}}/g)].map(match => match[1]).sort().join(",");
const errors = [];
for (const [language, catalog] of Object.entries(catalogs)) {
  for (const [key, value] of Object.entries(english)) {
    if (pluralKey.test(key)) continue;
    if (typeof catalog[key] !== "string" || !catalog[key].trim()) errors.push(`${language}: missing ${key}`);
    else if (variables(catalog[key]) !== variables(value)) errors.push(`${language}: interpolation mismatch in ${key}`);
  }
  for (const key of Object.keys(catalog)) {
    if (!(key in english) && !pluralKey.test(key)) errors.push(`${language}: unknown ${key}`);
  }
  for (const unit of ["years", "months", "days", "items"]) {
    for (const category of new Intl.PluralRules(language).resolvedOptions().pluralCategories) {
      const key = `${unit}_${category}`;
      if (!catalog[key]?.trim()) errors.push(`${language}: missing plural ${key}`);
      // Arabic one/two forms can express the count without a numeric placeholder.
      else if (!(language === "ar" && ["one", "two"].includes(category)) && variables(catalog[key]) !== "value") errors.push(`${language}: count placeholder in ${key}`);
    }
  }
}
const allowedLiteralText = new Set(["Timeline Studio", "SVG", "PNG", "PDF", "#2563EB", "YYYY-MM-DD"]);
for (const file of fs.readdirSync("src", { recursive: true }).filter(file => /\.[jt]sx?$/.test(file) && !file.endsWith(".test.js"))) {
  const source = ts.createSourceFile(file, fs.readFileSync(`src/${file}`, "utf8"), ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && ["t", "setStatus"].includes(node.expression.text) && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      const key = node.arguments[0].text;
      if (!(key in english) && !["years", "months", "days", "items"].includes(key)) errors.push(`${file}: unknown message ${key}`);
    }
    if (ts.isJsxText(node)) {
      const value = node.text.trim();
      if (/[A-Za-z]/.test(value) && !allowedLiteralText.has(value)) errors.push(`${file}: untranslated JSX text ${value}`);
    }
    if (ts.isJsxAttribute(node) && ["aria-label", "title", "label", "placeholder", "paletteLabel"].includes(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const value = node.initializer.text;
      if (/[A-Za-z]/.test(value) && !allowedLiteralText.has(value)) errors.push(`${file}: untranslated attribute ${value}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else console.log(`Five catalogs validated: messages, plural forms, interpolation, typed-call coverage and JSX text.`);
