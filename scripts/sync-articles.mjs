import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const repository = "nagisa77/blogs";
const output = resolve("src/generated/articles.json");

function ghApi(endpoint) {
  return JSON.parse(execFileSync("gh", ["api", endpoint], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }));
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/\+\+\+[\s\S]*?\+\+\+/m, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_`~|]/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseArticle(entry) {
  const file = ghApi(`repos/${repository}/contents/${encodeURIComponent(entry.path)}?ref=master`);
  const markdown = Buffer.from(file.content, "base64").toString("utf8");
  const frontmatter = markdown.match(/\+\+\+\s*([\s\S]*?)\s*\+\+\+/m)?.[1] ?? "";
  const title = frontmatter.match(/^title\s*=\s*["']?(.+?)["']?\s*$/m)?.[1]?.replace(/^['"]|['"]$/g, "") ?? entry.name.replace(/\.md$/i, "");
  const date = frontmatter.match(/^date\s*=\s*["']?([0-9-]+)["']?\s*$/m)?.[1] ?? "";
  const plain = stripMarkdown(markdown);
  const excerpt = `${plain.slice(0, 154).trim()}${plain.length > 154 ? "…" : ""}`;
  return {
    title,
    date,
    excerpt,
    path: entry.path,
    sha: entry.sha,
    sourceUrl: `https://github.com/${repository}/blob/master/${entry.path.split("/").map(encodeURIComponent).join("/")}`,
  };
}

try {
  const entries = ghApi(`repos/${repository}/contents?ref=master`)
    .filter((entry) => entry.type === "file" && entry.name.toLowerCase().endsWith(".md"));
  const articles = entries
    .map(parseArticle)
    .sort((a, b) => (b.date || "0000").localeCompare(a.date || "0000") || a.title.localeCompare(b.title, "zh-CN"));

  if (existsSync(output)) {
    const current = JSON.parse(readFileSync(output, "utf8"));
    if (JSON.stringify(current.articles) === JSON.stringify(articles)) {
      console.log(`Articles unchanged (${articles.length}) in ${repository}.`);
      process.exit(0);
    }
  }

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify({ syncedAt: new Date().toISOString(), articles }, null, 2)}\n`);
  console.log(`Synced ${articles.length} articles from ${repository}.`);
} catch (error) {
  console.error("Article sync failed. Ensure gh is authenticated for nagisa77/blogs.");
  throw error;
}
