/**
 * End-to-end registry smoke test:
 * 1. Serve ./public over HTTP (the real consumption path).
 * 2. Copy the fixture consumer to a temp dir, install deps.
 * 3. `shadcn add` theme + button + reveal from the served registry.
 * 4. Assert the files landed, then `next build` the consumer.
 * Exits non-zero on any failure.
 */
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

const ROOT = join(import.meta.dir, "..");
const PORT = 4873;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const file = Bun.file(join(ROOT, "public", path));
    if (!(await file.exists())) return new Response("nope", { status: 404 });
    if (path.endsWith(".json")) {
      // Rebase baked registryDependencies URLs onto this local server so the
      // dependency chain resolves without the live deployment.
      const body = (await file.text()).replaceAll(
        "https://ui.lscaturchio.xyz/r",
        `http://localhost:${PORT}/r`,
      );
      return new Response(body, { headers: { "content-type": "application/json" } });
    }
    return new Response(file);
  },
});

const work = mkdtempSync(join(tmpdir(), "ui-smoke-"));
console.log(`smoke consumer at ${work}`);

let failed = false;
try {
  cpSync(join(ROOT, "scripts/smoke-fixture"), work, { recursive: true });
  await $`bun install`.cwd(work);

  const base = `http://localhost:${PORT}/r`;
  await $`bunx --bun shadcn@latest add ${base}/theme.json ${base}/button.json ${base}/reveal.json ${base}/combobox.json --yes --overwrite`.cwd(work);

  const expected = [
    "app/identity.css",
    "lib/fonts.ts",
    "lib/utils.ts",
    "components/ui/button.tsx",
    "components/patterns/reveal.tsx",
    "components/ui/combobox.tsx",
    "components/ui/input-group.tsx",
  ];
  for (const f of expected) {
    if (!existsSync(join(work, f))) throw new Error(`expected file missing after add: ${f}`);
  }
  console.log("all expected files landed");

  await $`bun run build`.cwd(work);
  console.log("consumer build OK");
} catch (err) {
  failed = true;
  console.error("SMOKE FAILED:", err);
} finally {
  server.stop(true);
  rmSync(work, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
