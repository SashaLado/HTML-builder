const fs = require('fs');
const path = require('path');
const {mkdir} = require('fs');

function addFileHtml(fileName) {
  fs.stat(`06-build-page/project-dist/${fileName}`, function (err) {
    if (!err) {
      fs.truncate(`06-build-page/project-dist/${fileName}`, 0, function () {
        console.log('');
      });
    } else if (err.code === 'ENOENT') {
      fs.open(`06-build-page/project-dist/${fileName}`, 'w', (err) => {
        if (err) throw err;
      });
    }
  });
}

fs.stat('06-build-page/project-dist', function (err) {
  if (!err) {
    addFileHtml('index.html');
    addFileHtml('style.css');
    replace();
    assetsFolder();
  } else if (err.code === 'ENOENT') {
    fs.mkdir('06-build-page/project-dist', err => {
      if (err) throw err;
      addFileHtml('index.html');
      addFileHtml('style.css');
      replace();
      assetsFolder();
    });
  }
});

function replace() {
  let data = '';
  let readStream = fs.createReadStream(path.join(__dirname, 'template.html')
  );
  readStream.setEncoding('UTF8');
  readStream.on('data', function (chunk) {
    data += chunk;
  });
  readStream.on('end', function () {
    let template = data;
    fs.readdir('06-build-page/components',
      (err, files) => {
        if (err)
          console.log(err);
        else {
          files.forEach(file => {
            let fileExt = path.extname(file);
            if (fileExt === '.html') {
              let data = '';
              let readStream1 = fs.createReadStream(path.join(__dirname, `components/${file}`)
              );
              readStream1.setEncoding('UTF8');
              readStream1.on('data', function (chunk) {
                data += chunk;
              });
              readStream1.on('error', function (err) {
                console.log(err.stack);
              });

              readStream1.on('end', function () {
                if (file === 'about.html') {
                  template = template.replace(/{{about}}/i, data);
                } else if (file === 'articles.html') {
                  template = template.replace(/{{articles}}/i, data);
                } else if (file === 'footer.html') {
                  template = template.replace(/{{footer}}/i, data);
                } else if (file === 'header.html') {
                  template = template.replace(/{{header}}/i, data);
                  fs.appendFile('06-build-page/project-dist/index.html', `${template}`, function (err) {
                    if (err) throw err;
                  });
                }

              });
            }
          });
        }
      });

  });

  readStream.on('error', function (err) {
    console.log(err.stack);
  });
}


fs.readdir('06-build-page/styles',
  (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        let fileExt = path.extname(file);
        if (fileExt === '.css') {
          let data = '';
          let readStream = fs.createReadStream(path.join(__dirname, `styles/${file}`)
          );
          readStream.setEncoding('UTF8');
          readStream.on('data', function (chunk) {
            data += chunk;
          });
          readStream.on('error', function (err) {
            console.log(err.stack);
          });

          readStream.on('end', function () {
            fs.appendFile('06-build-page/project-dist/style.css', `${data}`, function (err) {
              if (err) throw err;
            });
          });

        }
      });
    }
  });

function assetsFolder() {
  fs.stat('06-build-page/project-dist/assets', function (err) {
    if (!err) {
      fs.readdir('06-build-page/project-dist/assets',
        (err, directories) => {
          if (err)
            console.log(err);
          else directories.forEach(dir => {
            fs.readdir(`06-build-page/project-dist/assets/${dir}`, (err, files) => {
              if (err) throw err;
              for (let fileD of files) {
                fs.unlink(path.join(`06-build-page/project-dist/assets/${dir}`, fileD), err => {
                  if (err) throw err;
                });
              }
            });
            copyFiles6(`assets/${dir}`, `project-dist/assets/${dir}`);
          });
        });
    } else if (err.code === 'ENOENT') {
      fs.mkdir('06-build-page/project-dist/assets', err => {
        if (err) throw err;
        fs.mkdir('06-build-page/project-dist/assets/fonts', err => {
          if (err) throw err;
          copyFiles6('assets/fonts', 'project-dist/assets/fonts');
        });
        fs.mkdir('06-build-page/project-dist/assets/img', err => {
          if (err) throw err;
          copyFiles6('assets/img', 'project-dist/assets/img');
        });
        fs.mkdir('06-build-page/project-dist/assets/svg', err => {
          if (err) throw err;
          copyFiles6('assets/svg', 'project-dist/assets/svg');
        });
      });
    }
  });
}

function copyFiles6(firstFolder6, destinationFolder6) {
  const firstDir6 = path.join(__dirname, firstFolder6);
  const destDir6 = path.join(__dirname, destinationFolder6);
  fs.readdir(firstDir6, (err, files) => {
    if (err) {
      throw err;
    }
    for (let i = 0; i < files.length; i += 1) {
      fs.copyFile(firstDir6 + '/' + files[i], destDir6 + '/' + files[i], function (err) {
        if (err)
          throw err;
      });
    }

  });
}