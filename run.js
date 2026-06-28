#!/usr/bin/env node
// Launcher: تشغيل الـ backend (NestJS) محلياً عبر "node run.js".
// يثبّت الحزم تلقائياً إن لم تكن مثبّتة، يولّد Prisma Client، ثم يشغّل start:dev.

const { spawnSync, spawn } = require("child_process");
const { existsSync } = require("fs");
const { join } = require("path");

const root = __dirname;
const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const npxCmd = isWindows ? "npx.cmd" : "npx";

function run(command, args) {
  // shell:true مطلوب على Windows لتشغيل ملفات .cmd (npm/npx) عبر spawn —
  // بدونه يفشل بخطأ EINVAL (مشكلة معروفة في Node على Windows).
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit", shell: isWindows });
  if (result.error) {
    console.error(`❌ تعذر تشغيل "${command}": ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`❌ "${command} ${args.join(" ")}" فشل برمز خروج ${result.status}${result.signal ? ` (signal: ${result.signal})` : ""}`);
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(join(root, ".env"))) {
  console.warn('⚠️  لم يتم العثور على ملف ".env" في backend/ — تأكد من إنشائه قبل الاستمرار (DATABASE_URL وغيرها).');
}

if (!existsSync(join(root, "node_modules"))) {
  console.log("📦 تثبيت حزم backend (npm install)...");
  run(npmCmd, ["install"]);
}

console.log("🔧 توليد Prisma Client...");
run(npxCmd, ["prisma", "generate"]);

console.log("🚀 تشغيل backend (NestJS) في وضع التطوير...");
const dev = spawn(npmCmd, ["run", "start:dev"], { cwd: root, stdio: "inherit", shell: isWindows });

dev.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => dev.kill("SIGINT"));
process.on("SIGTERM", () => dev.kill("SIGTERM"));
