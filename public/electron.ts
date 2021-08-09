'use strict'

import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';

/**
 * 메인 윈도우
 */
let mainWindow: BrowserWindow;

/**
 * ipc메인을 초기화 한다.
 */
const ipcMainInit = () => {
	ipcMain.handle('dark-mode:toggle', () => {
		if (nativeTheme.shouldUseDarkColors) {
			nativeTheme.themeSource = 'light'
		} else {
			nativeTheme.themeSource = 'dark'
		}
		return nativeTheme.shouldUseDarkColors
	})

	ipcMain.handle('dark-mode:system', () => {
		nativeTheme.themeSource = 'system'
	})
}

/**
 * 일렉트론을 초기화 한다.
 */
const createElectronInit = () => {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 680,
		center: true,
		kiosk: !isDev,
		resizable: true,
		fullscreen: false,
		fullscreenable: true,
		webPreferences: {
			// node환경처럼 사용하기
			nodeIntegration: true,
			enableRemoteModule: true,
			// 개발자도구
			devTools: isDev,
		},
	});
	
	ipcMainInit();
	// production에서는 패키지 내부 리소스에 접근.
	// 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드.
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

	if (isDev) {
		mainWindow.webContents.openDevTools({ mode: 'detach' });
	}

	mainWindow.setResizable(true);
	mainWindow.on('closed', () => (mainWindow = undefined!));
	mainWindow.focus();
};

/**
 * 일렉트론을 실행한다.
 */
app.on('ready', createElectronInit);

/**
 * 종료한다.
 */
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createElectronInit();
	}
});