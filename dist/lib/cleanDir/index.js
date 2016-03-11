"use strict";

const fs = require('fs');

module.exports = function (o) {
  if (!o.dir) throw 'cleanDir init expected dir property in options obj';

  return function cleanDir() {
    fs.readdir(o.dir, function (err, files) {
      files.forEach(function (file) {
        if (file === '.gitkeep') return;
        fs.unlink(o.dir + '/' + file);
      });
    });
  };
};