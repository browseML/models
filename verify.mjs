#!/usr/bin/env node
// SPDX-License-Identifier: MIT OR Apache-2.0
// Verify the models here, three ways, with no dependency (Node 18+):
//   1. every file against SHA256SUMS
//   2. every model against its pin (<model>.FORK.json, the record bankML and browseML refuse to answer without)
//   3. with --source, every model against its source's own published hash (Hugging Face's LFS sha256 at the pinned
//      revision) and every licence file against the source's Git blob id
//   node verify.mjs            # 1 and 2
//   node verify.mjs --source   # and 3 (asks huggingface.co)
import { createHash } from "node:crypto";
import { createReadStream, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL(".", import.meta.url).pathname;
const withSource = process.argv.includes("--source");
let failed = 0;
const report = (ok, what, more = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${what}${more ? " — " + more : ""}`); if (!ok) failed++; };

const sha256 = (path) => new Promise((ok, bad) => {
  const h = createHash("sha256");
  createReadStream(path).on("data", (d) => h.update(d)).on("end", () => ok(h.digest("hex"))).on("error", bad);
});
/** Git's blob id: sha1 of "blob <size>\0" + bytes (what a Git host records for a file). */
const gitBlob = (path) => { const b = readFileSync(path); return createHash("sha1").update(`blob ${b.length}\0`).update(b).digest("hex"); };

// 1. SHA256SUMS
for (const line of readFileSync(join(root, "SHA256SUMS"), "utf8").trim().split("\n")) {
  const [want, file] = line.split(/\s+/);
  let got = "";
  try { got = await sha256(join(root, file)); } catch (e) { report(false, file, e.code === "ENOENT" ? "missing (git lfs pull?)" : e.message); continue; }
  report(got === want, file, got === want ? `sha256 ${want.slice(0, 16)}…` : `sha256 ${got.slice(0, 16)}…, SHA256SUMS says ${want.slice(0, 16)}…`);
}

// 2 and 3. each model directory: its pin, and its source
for (const dir of readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory() && !d.startsWith("."))) {
  for (const forkFile of readdirSync(join(root, dir)).filter((f) => f.endsWith(".FORK.json"))) {
    const fork = JSON.parse(readFileSync(join(root, dir, forkFile), "utf8"));
    for (const f of fork.files ?? []) {
      const path = join(root, dir, f.path);
      const st = statSync(path, { throwIfNoEntry: false });
      if (!st) { report(false, `${dir}/${f.path} against its pin`, "missing"); continue; }
      const got = await sha256(path);
      report(got === f.sha256 && st.size === f.bytes, `${dir}/${f.path} against its pin (${forkFile})`,
        got === f.sha256 ? `${f.bytes} bytes, sha256 ${got.slice(0, 16)}…` : `sha256 ${got.slice(0, 16)}…, the pin says ${f.sha256.slice(0, 16)}…`);
      if (withSource && fork.source_repo && fork.source_revision) {
        // Hugging Face's own record of the file at that revision: its LFS sha256, and the Git blob ids of the rest
        const url = `https://huggingface.co/api/models/${fork.source_repo}/tree/${fork.source_revision}`;
        const tree = await (await fetch(url)).json();
        const entry = tree.find((e) => e.path === f.path);
        report(entry?.lfs?.oid === got, `${dir}/${f.path} against ${fork.source_repo}@${fork.source_revision.slice(0, 8)}`,
          entry?.lfs?.oid ? `Hugging Face's LFS sha256 ${entry.lfs.oid.slice(0, 16)}…` : "not found at the source");
        for (const extra of ["LICENSE", "NOTICE.txt", "MODEL-CARD.md"]) {
          const p = join(root, dir, extra), srcName = extra === "MODEL-CARD.md" ? "README.md" : extra;
          if (!statSync(p, { throwIfNoEntry: false })) continue;
          const src = tree.find((e) => e.path === srcName);
          report(src?.oid === gitBlob(p), `${dir}/${extra} against the source's ${srcName}`, src?.oid ? `Git blob ${src.oid.slice(0, 12)}…` : "not found at the source");
        }
      }
    }
  }
}
console.log(failed ? `\n${failed} check(s) failed` : "\nall verified");
process.exit(failed ? 1 : 0);
