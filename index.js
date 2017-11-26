const electron = require('electron');
const{ app, BrowserWindow, Menu, ipcMain } = electron;

var Datastore = require('nedb'), db = new Datastore({filename : 'quotes'});
db.loadDatabase();

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('quote:add',(event, author,quote) => {
   console.log("Even more things happened", author, quote);
   if (author.value=="") { author.value = undefined;}
   var doc = { author: author,
               quote: quote,
               day: new Date()
               };
   db.insert(doc, function (err, newDoc) {
    console.log("successfully inserted in database");
  });
});

ipcMain.on('quotes:getQuotes', (event) => {
  console.log("IPC main get quotes");
  db.find({}, function (err,docs){
    console.log(docs);
    mainWindow.webContents.send('quotes:receiveQuotes', (event, docs));
  });
})

const menuTemplate = [
  //On MacOS it merges with the first menu option,
  //Must find other solution
  {
    label : 'File',
    submenu : [
    { label : 'New ToDo',
      accelerator : process.plattform==='darwin' ? 'Command+N' : 'Ctrl+N',
    },
    {
      label : 'Clear Todos',
      accelerator : process.plattform==='darwin' ? 'Command+Shift+C' : 'Ctrl+Shift+C',
      click() {
        mainWindow.webContents.send('todo:clear');
      }
    },
    { label : 'Quit',
    accelerator : process.plattform==='darwin' ? 'Command+Q' : 'Ctrl+Q',
    click(){
      app.quit();
    }
  }
]
}
];

if(process.plattform === 'darwin'){
  //adds first arg to array
  menuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
  menuTemplate.push({
    label : 'Developer',
    submenu : [
      //shortcut for menu item - predefined
      {role : 'reload'},
      {label : 'Toggle Developer Tools',
      accelerator : process.plattform==='darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow){
        focusedWindow.toggleDevTools();
      }
    }]
  });
}
