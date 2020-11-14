const {app, BrowserWindow, globalShortcut, ipcMain} = require("electron");
const open = require("open");

const isMac = process.platform === 'darwin';

function createWindow() {

    const win = new BrowserWindow({
        width: 900,
        height: 600,
        icon: __dirname + (isMac ? "/assets/JSOff.icns" : "/assets/JSOff.png"),
        titleBarStyle: "hiddenInset",
        webPreferences: {
            nodeIntegration: true,
        },
        title: "JSOff",
    });

    win.loadFile(__dirname + '/public/index.html')

    // Resize event
    win.on('resize', () => {
        win.webContents.send("resize", win.getSize());
    });

    // Open link event
    ipcMain.handle('open', (e, link) => {
        open(link);
    });
}

/**
 * Create window on ready
 */
app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+T', () => {
        createWindow();
    })
}).then(createWindow);

/**
 * Close app when all windows closed
 */
app.on('window-all-closed', () => {
    app.quit();
});