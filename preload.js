const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  render_dim_file_main: (obj) => ipcRenderer.send("render_dim_file_main", obj),
  sendMsg: (msg) => ipcRenderer.send("render_msg_main", msg),
});
