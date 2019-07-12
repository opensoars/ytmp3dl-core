const fs = require('fs');

const ytmp3dl = require('./src/index.js');


let dls = [];
let vs = [
  //'NnTg4vzli5s',
  
/*  'sQVeK7Dt18U',
  'kqq_oq6QWZI',
  'd0TX75q6Y1M',

   'lFMkAdg0E-Q',
  'RaY4Rg-2sBA',

  'Owbd9lvNM2Q', */
    
  //'NnTg4vzli5s'
  //'RaY4Rg-2sBA'

];

ytmp3dl.cleanTemp();

vs.forEach(v => {

  let dl = new ytmp3dl.Download({ v });

  dl.on('error', (err) => {
    console.log('error', err);
    console.log(err.stack);
  });

  dl.on('success', (result) => {
    const outDir = __dirname + '/done';
    const fileName = result.file_name + '.' + result.file_ext;
    const output = outDir + '/' + fileName;

    ytmp3dl.Download.copyAndClean({
      result_file_location: result.file_location,
      file_ext: result.file_ext,
      output
    });
    console.log('success', result);

    console.log(dl.pub);
  });

  dl.on('callMethod', (method) => {
    console.log('callMethod', method);
  }); 

  dl.on('stream-progress', (o) => {
    console.log('stream-progress', o);
  });

  dl.on('conversion-progress', (o) => {
    console.log('conversion-progress', o);
  });

  dl.start();

  console.log('dl', dl);
});


