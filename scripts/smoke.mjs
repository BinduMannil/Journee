// End-to-end smoke test: starts the production server and asserts that key
// routes/APIs return expected status codes. Used in CI after build, and runnable
// locally via `npm run smoke`. Exits non-zero on any mismatch.
import { spawn } from "node:child_process";

const PORT = process.env.PORT ?? "3000";
const base = `http://127.0.0.1:${PORT}`;

// [path, expectedStatus] — 503s are the correct secure-by-default responses
// when Supabase/admin are unconfigured.
const checks = [
  ["/", 200],
  ["/discover", 200],
  ["/plan", 200],
  ["/saved", 200],
  ["/about", 200],
  ["/privacy", 200],
  ["/destinations/kyoto", 200],
  ["/destinations/nope", 404],
  ["/api/health", 200],
  ["/api/metrics", 200],
  ["/api/destinations", 200],
  ["/api/pathfinder?vibe=Electric", 200],
  ["/api/affiliate/link?category=hotels", 200],
  ["/api/affiliate/analytics", 503],
  ["/api/admin/status", 503],
  ["/api/admin/readiness?destinationId=kyoto", 503],
  ["/api/plan/ai", 405], // GET not allowed; POST-only (503 when AI unconfigured)
  ["/robots.txt", 200],
  ["/sitemap.xml", 200],
  ["/manifest.webmanifest", 200],
  ["/icon", 200],
  ["/opengraph-image", 200],
];

// [path, header, substring] — assert a response header contains an expected
// token. Guards the enforced security headers against silent regression.
const headerChecks = [
  ["/", "content-security-policy", "frame-ancestors 'none'"],
  ["/", "content-security-policy-report-only", "script-src 'self'"],
];

// detached so we can kill the whole process group (npm -> next-server child).
const server = spawn("npm", ["start"], {
  stdio: "ignore",
  env: { ...process.env, PORT },
  detached: true,
});

function cleanup(code) {
  try {
    process.kill(-server.pid, "SIGKILL");
  } catch {
    try {
      server.kill("SIGKILL");
    } catch {
      // ignore
    }
  }
  process.exit(code);
}

async function waitForReady(timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${base}/api/health`);
      if (r.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("server did not become ready in time");
}

try {
  await waitForReady();
  let failed = 0;
  for (const [path, expected] of checks) {
    let status = 0;
    try {
      const res = await fetch(`${base}${path}`, { redirect: "manual" });
      status = res.status;
    } catch (e) {
      status = -1;
    }
    const ok = status === expected;
    if (!ok) failed++;
    console.log(`${ok ? "ok  " : "FAIL"} ${path} -> ${status} (expected ${expected})`);
  }
  for (const [path, header, substring] of headerChecks) {
    let value = "";
    try {
      const res = await fetch(`${base}${path}`, { redirect: "manual" });
      value = res.headers.get(header) ?? "";
    } catch {
      value = "";
    }
    const ok = value.includes(substring);
    if (!ok) failed++;
    console.log(
      `${ok ? "ok  " : "FAIL"} ${path} [${header}] contains "${substring}" (got "${value}")`,
    );
  }
  const total = checks.length + headerChecks.length;
  console.log(`\n${total - failed}/${total} checks passed`);
  cleanup(failed === 0 ? 0 : 1);
} catch (e) {
  console.error(String(e));
  cleanup(1);
}
