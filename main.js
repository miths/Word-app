const electron = require("electron");
const { ipcMain, dialog, Menu } = electron;
const fs = require("fs");
const { app, BrowserWindow } = electron;
let win;
let filePath = undefined;

app.on("ready", () => {
  console.log("app is ready");
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
  });
  win.loadFile("index.html");
  //   win.webContents.openDevTools();
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});

ipcMain.on("save", (event, text) => {
  if (filePath == undefined) {
    dialog
      .showSaveDialog(win, {
        defaultPath: "filename.txt",
        filters: [
          {
            name: "Text File",
            extensions: ["txt"],
          },
        ],
      })
      .then((res) => {
        if (res.canceled === false) {
          filePath = res.filePath;
          fs.writeFile(res.filePath, text, (err) => {
            if (err) throw err;
            console.log("The file has been saved!");
            win.webContents.send("saved", "success");
          });
        } else {
          console.log("File save was canceled.");
        }
      })
      .catch((err) => console.log(err));
  } else {
    writeToFile(text);
  }
});

ipcMain.on("saveas", (event, text) => {
  dialog
    .showSaveDialog(win, {
      defaultPath: "filename.txt",
      filters: [
        {
          name: "Text File",
          extensions: ["txt"],
        },
      ],
    })
    .then((res) => {
      if (res.canceled === false) {
        filePath = res.filePath;
        fs.writeFile(res.filePath, text, (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
          win.webContents.send("saved", "success");
        });
      } else {
        console.log("File save was canceled.");
      }
    })
    .catch((err) => console.log(err));
});

function writeToFile(data) {
  fs.writeFile(filePath, data, (err) => {
    if (err) console.log("there was an error");
    console.log("file has been saved");
    win.webContents.send("saved", "success");
  });
}

const menuTemplate = [
  ...(process.platform == "darwin"
    ? [{ label: app.getName(), submenu: [{ role: "about" }] }]
    : []),
  {
    label: "File",
    submenu: [
      {
        label: "Save",
        accelerator: "CmdOrCtrl+S",
        click() {
          win.webContents.send("save-clicked");
        },
      },
      {
        label: "Save As",
        accelerator: "CmdOrCtrl+Shift+S",
        click() {
          win.webContents.send("saveas-clicked");
        },
      },
    ],
  },
];
