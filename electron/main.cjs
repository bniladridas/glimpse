const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const AUTH_PROTOCOL = "glimpse";

let mainWindow;
let pendingAuthUrl = null;

function getIndexUrl(authUrl) {
  const indexUrl = pathToFileURL(path.join(__dirname, "..", "dist", "index.html"));

  if (authUrl) {
    const callbackUrl = new URL(authUrl);
    indexUrl.search = callbackUrl.search;
    indexUrl.hash = callbackUrl.hash;
  }

  return indexUrl.toString();
}

function loadAuthUrl(authUrl) {
  if (!mainWindow) {
    pendingAuthUrl = authUrl;
    return;
  }

  mainWindow.loadURL(getIndexUrl(authUrl));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 680,
    title: "Glimpse",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: "#0c0a09",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(`${AUTH_PROTOCOL}://`)) {
      loadAuthUrl(url);
      return { action: "deny" };
    }

    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith(`${AUTH_PROTOCOL}://`)) {
      event.preventDefault();
      loadAuthUrl(url);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadURL(getIndexUrl(pendingAuthUrl));
  pendingAuthUrl = null;
}

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.setAsDefaultProtocolClient(AUTH_PROTOCOL);

  app.on("second-instance", (_event, argv) => {
    const authUrl = argv.find((arg) => arg.startsWith(`${AUTH_PROTOCOL}://`));
    if (authUrl) {
      loadAuthUrl(authUrl);
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on("open-url", (event, url) => {
    event.preventDefault();
    loadAuthUrl(url);
  });

  app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}
