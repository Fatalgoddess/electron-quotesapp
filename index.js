const electron = require('electron');
const{ app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow;

var Datastore = require('nedb'), db = new Datastore({filename : 'quotes'});
db.loadDatabase();

app.on('ready', () => {
  //TODO: Set icon property for OSX,
  //for additional windows;
  mainWindow = new BrowserWindow({icon:'assets/images/app-icon.png'});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  //Load menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

//Build Menu Template
const menuTemplate = [
      {
        label : 'Quit',
        accelerator : process.plattform==='darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){app.quit();}
      }
    ];

//For MacOS
if(process.plattform === 'darwin'){
  menuTemplate.unshift({});
}

//Load Dev Tools option
if(process.env.NODE_ENV !== 'production'){
  menuTemplate.push({
    label : 'Developer',
    submenu : [
      {role : 'reload'},
      {label : 'Toggle Developer Tools',
      accelerator : process.plattform==='darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow){
        focusedWindow.toggleDevTools();
      }
    }]
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

//Add a quote
ipcMain.on('quote:add',(event,author,quote) => {
   //console.log("Even more things happened", author, quote);
   if (author.value==""){
     author.value = undefined;
   }
   var doc = {
              author: author,
              quote: quote,
              day: new Date()
            };
   db.insert(doc, function (err, newDoc){
    //console.log("Successfully inserted in database");
  });
});

//Retrieve all quotes
ipcMain.on('quotes:getQuotes',(event) => {
  //console.log("IPC main get quotes");
  db.find({}, function (err,docs){
    //console.log(docs);
    mainWindow.webContents.send('quotes:receiveQuotes',(event, docs));
  });
});
