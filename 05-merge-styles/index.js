const fs = require('fs');
const path = require('path');

const {readdir} = require('fs/promises');

function addFile() {
  fs.stat('05-merge-styles/project-dist/bundle.css', function (err) {
    if (!err) {
      fs.truncate('05-merge-styles/project-dist/bundle.css', 0, function(){console.log('');});
    } else if (err.code === 'ENOENT') {
      fs.open('05-merge-styles/project-dist/bundle.css', 'w', (err) => {
        if (err) throw err;
      });
    }
  });
}

fs.readdir('05-merge-styles/styles',
  (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        let fileExt=path.extname(file);
        if (fileExt==='.css'){
          let data = "";
          let readStream = fs.createReadStream(path.join(__dirname, `styles/${file}`)
          );
          readStream.setEncoding('UTF8');
          readStream.on('data',function(chunk){data+=chunk;
          });
          readStream.on('error',function(err) {console.log(err.stack);
          });

          readStream.on('end',function(){
            fs.appendFile('05-merge-styles/project-dist/bundle.css', `${data}`, function (err) {
              if (err) throw err;
            });
          });

        }
      });
    }
  });

addFile();


