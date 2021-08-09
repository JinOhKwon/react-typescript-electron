'use strict';
exports.__esModule = true;
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var path = require("path");
/**
 * 메인 윈도우
 */
var mainWindow;
/**
 * ipc메인을 초기화 한다.
 */
var ipcMainInit = function () {
    electron_1.ipcMain.handle('dark-mode:toggle', function () {
        if (electron_1.nativeTheme.shouldUseDarkColors) {
            electron_1.nativeTheme.themeSource = 'light';
        }
        else {
            electron_1.nativeTheme.themeSource = 'dark';
        }
        return electron_1.nativeTheme.shouldUseDarkColors;
    });
    electron_1.ipcMain.handle('dark-mode:system', function () {
        electron_1.nativeTheme.themeSource = 'system';
    });
};
/**
 * 일렉트론을 초기화 한다.
 */
var createElectronInit = function () {
    mainWindow = new electron_1.BrowserWindow({
        width: 900,
        height: 680,
        center: true,
        kiosk: !isDev,
        resizable: true,
        fullscreen: false,
        fullscreenable: true,
        title: 'xxxx',
        webPreferences: {
            // node환경처럼 사용하기
            nodeIntegration: true,
            enableRemoteModule: true,
            // 개발자도구
            devTools: isDev
        }
    });
    ipcMainInit();
    // production에서는 패키지 내부 리소스에 접근.
    // 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드.
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : "file://" + path.join(__dirname, '../build/index.html'));
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
    mainWindow.setResizable(true);
    mainWindow.on('closed', function () { return (mainWindow = undefined); });
    mainWindow.focus();
};
/**
 * 일렉트론을 실행한다.
 */
electron_1.app.on('ready', createElectronInit);
/**
 * 종료한다.
 */
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createElectronInit();
    }
});
