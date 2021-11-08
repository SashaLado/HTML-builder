const fs = require('fs');
const path = require('path');

function copyFiles() {
  const firstFolder = 'files';
  const destinationFolder = 'files-copy';
  const firstDir = path.join(__dirname, firstFolder);
  const destDir = path.join(__dirname, destinationFolder);
  fs.readdir(firstDir, (err, files) => {
    if (err) {
      throw err;
    }
    for (let i = 0; i < files.length; i += 1) {
      fs.copyFile(firstDir + '/' + files[i], destDir + '/' + files[i], function (err) {
        if (err)
          throw err;
      });
    }

  });
}


fs.stat('04-copy-directory/files-copy', function(err) {
  if (!err) {
    fs.readdir('04-copy-directory/files-copy', (err, files) => {
      if (err) throw err;
      for (let fileD of files) {
        fs.unlink(path.join('04-copy-directory/files-copy', fileD), err => {
          if (err) throw err;
        });
      }
      copyFiles();
    });
  }
  else if (err.code === 'ENOENT') {
    fs.mkdir('04-copy-directory/files-copy', err => {
      if(err) throw err;
      console.log('Папка успешно создана');
      copyFiles();
    });
  }
});

