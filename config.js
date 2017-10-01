'use strict';
const Store = require('electron-store');

module.exports = new Store({
  defaults: {
    zoomFactor: 1,
    lastWindowState: {
      width: 960,
      height: 640
    }
  }
});
