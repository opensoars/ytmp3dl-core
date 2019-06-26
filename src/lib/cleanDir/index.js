"use strict";

const fs = require('fs');

module.exports = (o) => {
  if (!o.dir) throw 'cleanDir init expected dir property in options obj';

  return function cleanDir() {
    fs.readdir(o.dir, (err, files) => {
      files.forEach(file => {
        if (file === '.gitkeep') return;
        fs.unlinkSync(o.dir + '/' + file);
      });
    });
  }
};
