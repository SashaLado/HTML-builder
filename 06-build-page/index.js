const fs = require('fs');
const path = require('path');
const FSP = require('fs').promises;

function addFile(fileName) {
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

fs.access('06-build-page/project-dist', function(error){
  if (!error) {
    dirExist();
  } else {
    firstDir();
  }
});

function firstDir(){
  fs.promises.mkdir('06-build-page/project-dist');
  addFile('index.html');
  replace();
  addFile('style.css');
  copyStyles ();
  fs.promises.mkdir('06-build-page/project-dist/assets');
  copyDir('06-build-page/assets', '06-build-page/project-dist/assets');

}
async function dirExist(){
  await FSP.rmdir('06-build-page/project-dist', {recursive:true});
  await FSP.mkdir('06-build-page/project-dist',{recursive:true});
  await FSP.mkdir('06-build-page/project-dist/assets',{recursive:true});
  copyDir('06-build-page/assets', '06-build-page/project-dist/assets');
  addFile('index.html');
  replace();
  addFile('style.css');
  copyStyles ();
}
const dist = path.join(__dirname, 'project-dist');
function replace() {
  const input = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const output = fs.createWriteStream(path.join(dist, 'index.html'));
  let str = '';
  input.on('data', data => {
    str = data.toString();

    function mapper(elem) {
      return `{{${elem}}}`;
    }

    const componentsPath = path.join(__dirname, 'components');

    fs.readdir(
      componentsPath,
      {withFileTypes: true},
      (err, data) => {
        if (err) throw err;

        const temps = [];
        data.forEach(temp => {
          const fileName = temp.name.match(/([\w]*\.)*/)[0].replace('.', '');
          temps.push(mapper(fileName));
        });

        FSP
          .readdir(path.join(__dirname, 'components'))
          .then(result => {
            result.forEach((comp, ndx) => {
              const readableStream = fs.createReadStream(path.join(__dirname, 'components', comp), 'utf-8');
              readableStream.on('data', data => {
                str = str.replace(temps[ndx], data);

                if (!temps.find(temp => str.includes(temp))) {
                  output.write(str);
                }
              });
            });
          });
      }
    );
  });
}

function copyStyles () {
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
}





function copyDir(scr, dest){
  fs.readdir(scr,{withFileTypes:true},(err,files)=>{
    if(err) console.log(err);
    else{
      files.forEach((file)=> {
        const srcPath = path.resolve(scr,file.name);
        const destPath = path.resolve(dest,file.name);
        if (file.isDirectory()===true){
          FSP.mkdir(destPath,{recursive:true});
          copyDir(srcPath,destPath);
        } else{
          FSP.copyFile(srcPath,destPath);
        }
      });
    }
  });
}



