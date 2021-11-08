const fs = require('fs');
const path = require('path');


var data = "";
var readStream = fs.createReadStream(path.join(__dirname, 'text.txt')
);
readStream.setEncoding('UTF8');
readStream.on('data',function(chunk){data+=chunk;
});
readStream.on('end',function(){console.log(data);
});

readStream.on('error',function(err) {console.log(err.stack);
});

