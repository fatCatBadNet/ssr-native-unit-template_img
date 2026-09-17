#!/usr/bin/env node
// 把 outsourcing/<模板>/output/<lang>/ 下处理好的多语言图片批量回迁到主工程
// public/images/<模板>/assets/image/<实际语言目录>/。
//
// 目标语言目录的大小写不以本仓库为准，而是按主工程 pages/<模板>/build.config.json
// 内图片路径的第一段反解（各模板惯例不统一：creditCard 用 Es/Ja/Thai，diceWheel 用
// es/ja/pt，混用且 main.js 按 config 原样拼接，写错大小写页面就会 404）。
// config 里找不到该语言时退回磁盘已有目录的大小写，最后兜底小写语言码。
//
// 用法：
//   node scripts/deploy-images.mjs --template nineGridTurn --dry-run   # 预览
//   node scripts/deploy-images.mjs --template nineGridTurn             # 正式回迁
//   node scripts/deploy-images.mjs --template nineGridTurn --lang ja,ar
//
// 可选参数：
//   --output <dir>   产物目录，默认 outsourcing/<模板>/output
//   --repo <path>    主工程根目录，默认 <本仓库>/../ssr-native-unit-template
//   --strict-size    尺寸与 source/ 同名源图不一致时报错退出（默认仅告警）

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  copyFileSync,
  statSync,
} from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const IMG_REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);

function parseArgs(argv) {
  const args = { langs: null, dryRun: false, strictSize: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    switch (token) {
      case "--template":
        args.template = argv[++i];
        break;
      case "--output":
        args.output = argv[++i];
        break;
      case "--repo":
        args.repo = argv[++i];
        break;
      case "--lang":
        args.langs = String(argv[++i] || "")
          .split(",")
          .map((code) => code.trim().toLowerCase())
          .filter(Boolean);
        break;
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--strict-size":
        args.strictSize = true;
        break;
      default:
        fail(`未知参数：${token}`);
    }
  }
  if (!args.template) fail("缺少 --template <模板名>");
  return args;
}

function fail(message) {
  console.error(`[deploy-images] ${message}`);
  process.exit(1);
}

// 从主工程 build.config.json 收集各语言在图片路径里实际使用的目录名（大小写权威来源）
function configLanguageFolders(configPath, lang) {
  if (!existsSync(configPath)) return null;
  let config;
  try {
    config = JSON.parse(readFileSync(configPath, "utf8"));
  } catch {
    return null;
  }
  const found = new Set();
  const consider = (value) => {
    if (typeof value !== "string") return;
    if (!IMAGE_EXTENSIONS.has(extname(value).toLowerCase())) return;
    const head = value.split("/")[0];
    if (head && head.toLowerCase() === lang && value.includes("/")) found.add(head);
  };
  for (const entry of Object.values(config)) {
    if (!entry || typeof entry !== "object") continue;
    for (const value of Object.values(entry)) {
      if (Array.isArray(value)) {
        value.forEach(consider);
      } else if (value && typeof value === "object") {
        Object.values(value).forEach(consider);
      } else {
        consider(value);
      }
    }
  }
  if (!found.size) return null;
  return [...found].sort()[0];
}

// config 没写该语言的图片路径时，按磁盘已有目录做大小写无关匹配
function diskLanguageFolder(imageDir, lang) {
  if (!existsSync(imageDir)) return null;
  const match = readdirSync(imageDir, { withFileTypes: true })
    .filter((item) => item.isDirectory() && item.name.toLowerCase() === lang)
    .map((item) => item.name)
    .sort()[0];
  return match || null;
}

function listLanguageDirs(outputDir) {
  if (!existsSync(outputDir)) fail(`产物目录不存在：${outputDir}`);
  return readdirSync(outputDir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .sort();
}

function listImages(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isFile() && IMAGE_EXTENSIONS.has(extname(item.name).toLowerCase()))
    .map((item) => item.name)
    .sort();
}

function imageSize(file) {
  try {
    const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
      encoding: "utf8",
    });
    const width = Number(/pixelWidth: (\d+)/.exec(out)?.[1]);
    const height = Number(/pixelHeight: (\d+)/.exec(out)?.[1]);
    if (width && height) return { width, height };
  } catch {
    // sips 不可用或格式不支持时静默跳过尺寸核对
  }
  return null;
}

// 在 source/ 里找同名源图（不限定语言子目录），用于尺寸核对
function findSourceImage(sourceDir, fileName) {
  if (!existsSync(sourceDir)) return null;
  const stack = [sourceDir];
  while (stack.length) {
    const current = stack.pop();
    for (const item of readdirSync(current, { withFileTypes: true })) {
      const child = join(current, item.name);
      if (item.isDirectory()) stack.push(child);
      else if (item.name === fileName) return child;
    }
  }
  return null;
}

const args = parseArgs(process.argv.slice(2));
const mainRepoRoot = resolve(IMG_REPO_ROOT, args.repo || "../ssr-native-unit-template");
const outputDir = resolve(IMG_REPO_ROOT, args.output || `outsourcing/${args.template}/output`);
const sourceDir = resolve(IMG_REPO_ROOT, `outsourcing/${args.template}/source`);
const imageDir = join(mainRepoRoot, "public", "images", args.template, "assets", "image");
const configPath = join(mainRepoRoot, "pages", args.template, "build.config.json");

if (!existsSync(imageDir)) {
  fail(`主工程图片目录不存在：${imageDir}`);
}

const plans = [];
for (const langDirName of listLanguageDirs(outputDir)) {
  const lang = langDirName.toLowerCase();
  if (args.langs && !args.langs.includes(lang)) continue;
  const targetFolder =
    configLanguageFolders(configPath, lang) ||
    diskLanguageFolder(imageDir, lang) ||
    lang;
  for (const fileName of listImages(join(outputDir, langDirName))) {
    plans.push({
      lang,
      from: join(outputDir, langDirName, fileName),
      to: join(imageDir, targetFolder, fileName),
      targetFolder,
      fileName,
    });
  }
}

if (!plans.length) {
  fail(`没有可回迁的图片：${outputDir}${args.langs ? `（语言过滤：${args.langs.join("、")}）` : ""}`);
}

let copied = 0;
let sizeWarned = 0;
const sizeErrors = [];

console.log(`模板：${args.template}`);
console.log(`产物：${outputDir}`);
console.log(`目标：${imageDir}`);
console.log(args.dryRun ? "模式：dry-run 预览\n" : "模式：正式回迁\n");

for (const plan of plans) {
  const displayFrom = relative(IMG_REPO_ROOT, plan.from);
  const displayTo = relative(mainRepoRoot, plan.to);

  // 尺寸核对：与 source/ 内同名源图比对，不一致默认告警，--strict-size 时报错退出
  {
    const outputSize = imageSize(plan.from);
    const sourceFile = findSourceImage(sourceDir, plan.fileName);
    const sourceSize = sourceFile ? imageSize(sourceFile) : null;
    if (outputSize && sourceSize) {
      const sizeMatches =
        outputSize.width === sourceSize.width && outputSize.height === sourceSize.height;
      if (!sizeMatches) {
        const message =
          `尺寸不一致 ${plan.fileName}：产出 ${outputSize.width}x${outputSize.height}，` +
          `源图 ${sourceSize.width}x${sourceSize.height}（${relative(IMG_REPO_ROOT, sourceFile)}）`;
        if (args.strictSize) sizeErrors.push(message);
        else {
          sizeWarned += 1;
          console.warn(`  ⚠ ${message}`);
        }
      }
    }
  }

  if (existsSync(plan.to) && statSync(plan.to).isFile()) {
    console.log(`  覆盖 ${displayTo} ← ${displayFrom}`);
  } else {
    console.log(`  新增   ${displayTo} ← ${displayFrom}`);
  }
  if (!args.dryRun) {
    mkdirSync(join(plan.to, ".."), { recursive: true });
    copyFileSync(plan.from, plan.to);
  }
  copied += 1;
}

console.log(
  `\n合计 ${copied} 张${args.dryRun ? "（dry-run 未写入）" : "已回迁"}` +
    (sizeWarned ? `，${sizeWarned} 张尺寸告警` : "") +
    "。",
);
if (!args.dryRun) {
  console.log("下一步：在主工程真实页面逐语言验证加载与显示，再登记 multilingual-review.json。");
}
if (sizeErrors.length) {
  console.error(`\n[deploy-images] ${sizeErrors.length} 张尺寸不一致（--strict-size）：`);
  sizeErrors.forEach((message) => console.error(`  ✗ ${message}`));
  process.exit(1);
}
