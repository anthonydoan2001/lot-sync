import { app, BrowserWindow, shell } from "electron";
import { spawn, ChildProcess } from "node:child_process";
import { join } from "node:path";
import { createServer } from "node:net";

const IS_DEV = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let nextProcess: ChildProcess | null = null;

async function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, () => {
      const address = srv.address();
      if (address && typeof address === "object") {
        const { port } = address;
        srv.close(() => resolve(port));
      } else {
        reject(new Error("Failed to acquire port"));
      }
    });
  });
}

async function waitForServer(url: string, timeoutMs = 20_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // ignore, retry
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`Next.js server did not respond at ${url} within ${timeoutMs}ms`);
}

async function startNextServer(): Promise<string> {
  const port = await findFreePort();
  const hostname = "127.0.0.1";

  const standaloneDir = IS_DEV
    ? join(process.cwd(), ".next", "standalone")
    : join(process.resourcesPath, ".next", "standalone");

  const serverJs = join(standaloneDir, "server.js");

  const dbPath = join(app.getPath("userData"), "lotsync.db");

  const env = {
    ...process.env,
    ELECTRON_RUN_AS_NODE: "1",
    NODE_ENV: "production",
    PORT: String(port),
    HOSTNAME: hostname,
    LOTSYNC_DB_PATH: dbPath,
  };

  nextProcess = spawn(process.execPath, [serverJs], {
    cwd: standaloneDir,
    env,
    stdio: "inherit",
  });

  nextProcess.on("exit", (code) => {
    console.error(`Next.js server exited with code ${code}`);
    if (!app.isReady()) return;
    app.quit();
  });

  const url = `http://${hostname}:${port}`;
  await waitForServer(url);
  return url;
}

function createWindow(url: string) {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#0a0a0a",
    title: "LotSync",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url: openUrl }) => {
    shell.openExternal(openUrl);
    return { action: "deny" };
  });

  mainWindow.loadURL(url);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    try {
      const url = await startNextServer();
      createWindow(url);
    } catch (err) {
      console.error("Failed to start:", err);
      app.quit();
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0 && mainWindow === null) {
        // should not happen; server already running
      }
    });
  });

  app.on("window-all-closed", () => {
    if (nextProcess) nextProcess.kill();
    app.quit();
  });

  app.on("before-quit", () => {
    if (nextProcess) nextProcess.kill();
  });
}
