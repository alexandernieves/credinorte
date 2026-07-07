'use strict';

const { app, BrowserWindow, Menu, Tray, shell, dialog, nativeImage } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// ─── Configuración ───────────────────────────────────────────────────────────
const IS_DEV       = process.env.ELECTRON_IS_DEV === '1';
const SERVER_URL   = IS_DEV
  ? 'http://localhost:3000'                            // Desarrollo: servidor local
  : 'https://credinorte-frontend.onrender.com';       // Producción: Render

const APP_NAME     = 'CreditNorte';
const WINDOW_MIN_W = 1280;
const WINDOW_MIN_H = 800;

let mainWindow = null;
let tray       = null;
let splashWin  = null;

// ─── Auto Updater ─────────────────────────────────────────────────────────────
function setupAutoUpdater() {
  if (IS_DEV) return;  // No verificar updates en desarrollo

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Actualización disponible',
      message: `Nueva versión ${info.version} disponible.\nSe descargará en segundo plano y se instalará al cerrar la app.`,
      buttons: ['Entendido']
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '¡Actualización lista!',
      message: `La versión ${info.version} ya está descargada.\n¿Deseas reiniciar ahora para instalarla?`,
      buttons: ['Reiniciar ahora', 'Más tarde']
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (err) => {
    console.error('Error en auto-updater:', err);
  });

  // Verificar actualizaciones cada hora
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 60 * 60 * 1000);
}

// ─── Splash Screen ─────────────────────────────────────────────────────────────
function createSplashWindow() {
  splashWin = new BrowserWindow({
    width: 480,
    height: 300,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: { nodeIntegration: false }
  });

  splashWin.loadURL(`data:text/html,
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: white;
          overflow: hidden;
        }
        .logo {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(99,102,241,0.4);
        }
        h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        p { color: #94a3b8; margin-top: 6px; font-size: 14px; }
        .loader {
          width: 200px; height: 3px;
          background: #1e293b;
          border-radius: 4px;
          margin-top: 32px;
          overflow: hidden;
        }
        .loader-bar {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 4px;
          animation: load 2s ease-in-out forwards;
        }
        @keyframes load {
          from { width: 0%; }
          to   { width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="logo">💼</div>
      <h1>CreditNorte</h1>
      <p>Cargando el sistema...</p>
      <div class="loader"><div class="loader-bar"></div></div>
    </body>
    </html>
  `);
}

// ─── Ventana Principal ─────────────────────────────────────────────────────────
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: WINDOW_MIN_W,
    minHeight: WINDOW_MIN_H,
    show: false,   // Se muestra sólo cuando carga el contenido
    title: APP_NAME,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    }
  });

  // Cargar la URL del servidor
  mainWindow.loadURL(SERVER_URL).catch(() => {
    // Si falla la carga, mostrar página de error offline
    mainWindow.loadURL(`data:text/html,
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: #0f172a; color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            height: 100vh; text-align: center; padding: 40px;
          }
          .icon { font-size: 64px; margin-bottom: 24px; }
          h1 { font-size: 24px; font-weight: 700; color: #f87171; }
          p { color: #94a3b8; margin-top: 12px; max-width: 400px; line-height: 1.6; }
          button {
            margin-top: 32px; padding: 12px 28px;
            background: #6366f1; color: white; border: none;
            border-radius: 10px; font-size: 15px; cursor: pointer;
            transition: opacity 0.2s;
          }
          button:hover { opacity: 0.85; }
          .server { margin-top: 16px; color: #475569; font-size: 12px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="icon">⚠️</div>
        <h1>Sin conexión al servidor</h1>
        <p>No se pudo conectar con el servidor de CreditNorte.<br>Verifica que tengas acceso a la red.</p>
        <button onclick="location.reload()">🔄 Reintentar</button>
        <div class="server">Servidor: ${SERVER_URL}</div>
      </body>
      </html>
    `);
  });

  // Cuando termina de cargar, cerrar splash y mostrar ventana
  mainWindow.webContents.once('did-finish-load', () => {
    if (splashWin && !splashWin.isDestroyed()) {
      splashWin.close();
      splashWin = null;
    }
    mainWindow.show();
    setupAutoUpdater();
  });

  // Abrir links externos en el navegador del sistema
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── Menú de la Aplicación ─────────────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: APP_NAME,
      submenu: [
        {
          label: `Versión ${app.getVersion()}`,
          enabled: false
        },
        { type: 'separator' },
        {
          label: 'Verificar actualizaciones',
          click: () => {
            if (!IS_DEV) autoUpdater.checkForUpdatesAndNotify();
            else dialog.showMessageBox({ message: 'Las actualizaciones no están disponibles en modo desarrollo.' });
          }
        },
        { type: 'separator' },
        { role: 'quit', label: 'Salir' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        {
          label: 'Recargar',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow && mainWindow.reload()
        },
        {
          label: 'Pantalla completa',
          accelerator: 'F11',
          click: () => mainWindow && mainWindow.setFullScreen(!mainWindow.isFullScreen())
        },
        { type: 'separator' },
        IS_DEV ? { role: 'toggleDevTools', label: 'Herramientas de desarrollo' } : { type: 'separator' }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ─── System Tray ──────────────────────────────────────────────────────────────
function createTray() {
  // Ícono simple en base64 (16x16 blanco) — reemplazar con el ícono real
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip(APP_NAME);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir CreditNorte', click: () => mainWindow && mainWindow.show() },
    { type: 'separator' },
    { label: 'Salir', click: () => app.quit() }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => mainWindow && mainWindow.show());
}

// ─── Lifecycle de la App ──────────────────────────────────────────────────────
app.whenReady().then(() => {
  buildMenu();
  createTray();
  createSplashWindow();

  // Dar 2 segundos al splash antes de cargar la ventana principal
  setTimeout(() => {
    createMainWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  // En macOS las apps permanecen en el dock aunque se cierre la ventana
  if (process.platform !== 'darwin') app.quit();
});

// Prevenir múltiples instancias
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
