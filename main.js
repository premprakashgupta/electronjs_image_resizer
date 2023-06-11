const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const resizeImg = require("resize-img");
function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 600,
    x: 10,
    y: 10,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: false,
    },
    autoHideMenuBar: true,
  });

  ipcMain.on("render_dim_file_main", (event, obj) => {
    if (resizeme(obj)) {
      showPopup("info", "File saved successfully");
    }
  });
  ipcMain.on("render_msg_main", (event, msg) => {
    showPopup("error", msg);
  });

  win.loadFile("index.html");
}
// function to resize image
async function resizeme(obj) {
  try {
    const resizedImage = await resizeImg(fs.readFileSync(obj.filePath), {
      width: parseInt(obj.width),
      height: parseInt(obj.height),
    });
    const savePath = await showSaveDialog();
    if (savePath.filePath) {
      fs.writeFileSync(savePath.filePath, resizedImage);
    }
  } catch (error) {
    return false;
  }

  return true;
}
// function to open dialog for save file where you want
async function showSaveDialog() {
  return new Promise((resolve) => {
    dialog
      .showSaveDialog({
        title: "Save File",
        defaultPath: path.join(app.getPath("downloads"), "resized-image.jpg"),
      })
      .then((result) => {
        resolve(result);
        showNotification();
      });
  });
}

function showPopup(type, msg) {
  dialog.showMessageBoxSync({
    type: type,
    title: "Error",
    message: msg,
    buttons: ["OK"],
  });
}
function showNotification() {
  const notification = new Notification("Resize Complete", {
    body: "Click to open file",
  });
  // notification.onclick=()=>{

  // }
}
// main file main methods
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
