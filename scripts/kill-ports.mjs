// Cross-platform port cleaner.
// Kills any process listening on the given TCP ports so `npm start`
// can always boot fresh — regardless of leftover dev servers.
import { execSync } from "node:child_process";

const PORTS = [4000, 5173];
const isWin = process.platform === "win32";

function killPort(port) {
  try {
    if (isWin) {
      const out = execSync(`netstat -ano | findstr :${port}`, { stdio: ["ignore", "pipe", "ignore"] }).toString();
      const pids = [...new Set(out.trim().split(/\r?\n/).map((l) => l.trim().split(/\s+/).pop()).filter(Boolean))];
      for (const pid of pids) {
        try { execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" }); } catch {}
      }
      if (pids.length) console.log(`✓ Freed port ${port} (killed ${pids.join(", ")})`);
      else console.log(`✓ Port ${port} already free`);
    } else {
      const out = execSync(`lsof -ti tcp:${port}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
      if (out) {
        execSync(`kill -9 ${out.split("\n").join(" ")}`, { stdio: "ignore" });
        console.log(`✓ Freed port ${port} (killed ${out.replace(/\n/g, ", ")})`);
      } else {
        console.log(`✓ Port ${port} already free`);
      }
    }
  } catch {
    console.log(`✓ Port ${port} already free`);
  }
}

console.log("🧹 Cleaning up ports before start…");
PORTS.forEach(killPort);
