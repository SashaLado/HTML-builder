const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');


function fileHandler(){

  fs.open('02-write-file/testFile.txt', 'w', (err) => {
    if(err) throw err;
  });

}



fileHandler();
console.log('Write there');
const rl = readline.createInterface({ input, output });
rl.on('line', (line) => {
  if (line==='exit') {
    console.log('good bye');
    process.exit(0);
  }
  fs.appendFile('02-write-file/testFile.txt', `${line}`, function (err) {
    if (err) throw err;
  });
});


rl.on('SIGINT', () => {
  console.log('\nBye bye');
  process.exit(0);
});

