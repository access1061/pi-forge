import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const FORGE_DIR = ".forge";
const ACTIVE_DIR = path.join(FORGE_DIR, "active");
const DONE_DIR = path.join(FORGE_DIR, "done");
const RETRO_DIR = path.join(FORGE_DIR, "retro");

async function ensureForgeDirs() {
  await mkdir(ACTIVE_DIR, { recursive: true });
  await mkdir(DONE_DIR, { recursive: true });
  await mkdir(RETRO_DIR, { recursive: true });
}

async function readIfExists(filePath: string) {
  if (!existsSync(filePath)) return "";
  return await readFile(filePath, "utf8");
}

function nowId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export default function forgeExtension(pi: any) {
  pi.on("session_start", async (_event: any, ctx: any) => {
    await ensureForgeDirs();
    ctx.ui.notify("Pi Forge workflow loaded", "info");
  });

  pi.registerCommand("forge", {
    description: "Start a forge-style task planning loop",
    handler: async (args: string, ctx: any) => {
      await ensureForgeDirs();
      const task = args?.trim() || "Untitled task";

      const plan = `# Active Forge Task\n\n## Task\n${task}\n\n## Status\nplanning\n\n## Plan\n- [ ] Understand request\n- [ ] Inspect relevant files\n- [ ] Define smallest safe change\n- [ ] Execute\n- [ ] Verify\n- [ ] Record lesson if reusable\n`;

      await writeFile(path.join(ACTIVE_DIR, "plan.md"), plan, "utf8");
      await writeFile(path.join(ACTIVE_DIR, "status.md"), `# Status\n\nCurrent: planning\n\nTask: ${task}\n`, "utf8");
      ctx.ui.notify("Forge task created in .forge/active/", "success");
    },
  });

  pi.registerCommand("forge-status", {
    description: "Show current forge task status",
    handler: async (_args: string, ctx: any) => {
      await ensureForgeDirs();
      const status = await readIfExists(path.join(ACTIVE_DIR, "status.md"));
      const plan = await readIfExists(path.join(ACTIVE_DIR, "plan.md"));
      ctx.ui.notify(status || plan || "No active forge task found.", "info");
    },
  });

  pi.registerCommand("forge-done", {
    description: "Close the current forge task",
    handler: async (_args: string, ctx: any) => {
      await ensureForgeDirs();
      const plan = await readIfExists(path.join(ACTIVE_DIR, "plan.md"));
      const status = await readIfExists(path.join(ACTIVE_DIR, "status.md"));

      if (!plan && !status) {
        ctx.ui.notify("No active forge task to close.", "warn");
        return;
      }

      const donePath = path.join(DONE_DIR, `${nowId()}.md`);
      await writeFile(donePath, `# Done Forge Task\n\n## Plan\n${plan}\n\n## Status\n${status}\n`, "utf8");
      await writeFile(path.join(ACTIVE_DIR, "plan.md"), "", "utf8");
      await writeFile(path.join(ACTIVE_DIR, "status.md"), "", "utf8");
      ctx.ui.notify(`Forge task closed: ${donePath}`, "success");
    },
  });
}
