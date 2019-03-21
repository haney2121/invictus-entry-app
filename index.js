const electron = require("electron");
const url = require("url"); //core node js module
const path = require("path"); //core node js module

const { app, BrowserWindow, Menu, ipcMain } = electron;

//set env
// process.env.NODE_ENV = "production";

let mainWindow;
let entryWindow;

//listen for app to be ready
app.on("ready", function() {
  //create new window
  mainWindow = new BrowserWindow({});
  //load html into windo
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true
      // makes url file://dirname/mainWindow.html
    })
  );
  //Quit app when closed
  mainWindow.on("closed", function() {
    app.quit();
  });
  //build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //insert menu
  Menu.setApplicationMenu(mainMenu);
});

//Handle add create add window
function createEntryWindow() {
  entryWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: "Add an Entry to the List"
  });
  //load html into windo
  entryWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addEntry.html"),
      protocol: "file:",
      slashes: true
      // makes url file://dirname/addEntry.html
    })
  );
}

//catch entries:add
ipcMain.on("entries:add", function(e, entries) {
  mainWindow.webContents.send("entries:add", entries);
  entryWindow.close();
});

//create menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        accelerator: process.platform == "darwin" ? "Command+N" : "Ctrl+N",
        click() {
          createEntryWindow();
        }
      },
      {
        label: "Clear Items",
        accelerator: process.platform == "darwin" ? "Command+X" : "Ctrl+X",
        click() {
          mainWindow.webContents.send("entries:clear");
        }
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

//If mac, add empty {} to the menu for the file button
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

//add Developer tools item if not in production
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
