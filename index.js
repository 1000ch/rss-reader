'use strict';
const electron = require('electron');
const devtron = require('devtron');
const config = require('./config');

let mainWindow;
let isQuitting = false;

const isAlreadyRunning = electron.app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

if (isAlreadyRunning) {
  electron.app.quit();
}

function createMainWindow() {
  const lastWindowState = config.get('lastWindowState');

  const window = new electron.BrowserWindow({
    title: electron.app.getName(),
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height
  });

  window.loadURL(`file://${__dirname}/index.html`);

  window.on('close', e => {
    if (!isQuitting) {
      e.preventDefault();

      if (process.platform === 'darwin') {
        electron.app.hide();
      } else {
        window.hide();
      }
    }
  });

  devtron.install();

  return window;
}

electron.app.on('ready', () => {
  mainWindow = createMainWindow();

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('new-window', (e, url) => {
    electron.shell.openExternal(url);
  });
});

electron.app.on('activate', () => {
  mainWindow.show();
});

electron.app.on('before-quit', () => {
  isQuitting = true;

  if (!mainWindow.isFullScreen()) {
    config.set('lastWindowState', mainWindow.getBounds());
  }
});
