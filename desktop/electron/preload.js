'use strict';

const { contextBridge, ipcRenderer } = require('electron');

// Bridge seguro entre el renderer (la web) y el proceso principal (Electron)
// Solo expone APIs específicas y controladas, sin exponer Node.js completo

contextBridge.exposeInMainWorld('creditnorteApp', {
  // Versión de la app
  getVersion: () => ipcRenderer.invoke('get-version'),

  // Plataforma del sistema operativo
  platform: process.platform,

  // Indicador de entorno
  isDev: process.env.ELECTRON_IS_DEV === '1',
});
