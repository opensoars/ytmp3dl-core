"use strict";

const fs = require('fs');

const ytdl = require('./dist/index.js');


let dls = [];
let vs = [
  //'NnTg4vzli5s',
  //'sQVeK7Dt18U',
  'ynMPpTU_VuI'
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
      file_name: result.file_name
    });
    console.log('success', result);
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
});
