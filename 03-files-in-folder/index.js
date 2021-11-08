const fs = require('fs');
const path = require('path');

const {readdir} = require('fs/promises');
let fileSize;

fs.readdir('03-files-in-folder/secret-folder',
  { withFileTypes: true },
  (err, files) => {
    console.log('\nCurrent directory files:');
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        fs.stat(`03-files-in-folder/secret-folder/${file.name}`, (err, stats) => {
          fileSize=Math.round(stats.size*0.001);
          if (file.isFile()===true){
            let fileBase=file.name;
            let fileName=path.parse(fileBase).name;
            let fileExt=path.extname(fileBase);
            fileExt=fileExt.slice(1);
            console.log(fileName,'-',fileExt,'-',fileSize,'kb');
          }
        });
      });
    }
  });


