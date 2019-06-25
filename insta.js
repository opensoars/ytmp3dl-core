"use strict";

const fs = require('fs');

const ytdl = require('./dist/index.js');


let dls = [];
let vs = [
  'NnTg4vzli5s',
  'sQVeK7Dt18U',
  'kqq_oq6QWZI',
  'd0TX75q6Y1M',

   'lFMkAdg0E-Q',
  'RaY4Rg-2sBA',


  
  //'NnTg4vzli5s'
  //'RaY4Rg-2sBA'

];

vs.forEach(v => {
  let dl = new ytdl.Download({ v });

  dl.on('error', (err) => {
    console.log('error', err);
    console.log(err.stack);
  });

  dl.on('success', (result) => {
    ytdl.Download.copyAndClean({
      dir: __dirname + '/done',
      result_file_location: result.file_location,
      file_ext: dl.file_ext,
      file_name: result.file_name + result.file_ext
    });
    console.log('success', result);
  });

  dl.on('callMethod', (method) => {
    console.log('callMethod', method);
  }); 

  dl.on('stream-progress', (o) => {
    console.log('stream-progress', {
       ...o, 
       '%': Math.ceil(o.bytesWritten / (o['content-length'] / 100) * 100) / 100})
  });

  dl.on('conversion-progress', (o) => {
    console.log('conversion-progress', o);
  });


  dl.start();
});
