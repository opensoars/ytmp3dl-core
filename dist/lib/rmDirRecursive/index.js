"use strict";

const fs = require('fs');

module.exports = function (o) {
  if (!o.dir) throw 'rmDirRecursive init expected dir property in options obj';

  return function rmDirRecursive() {

    fs.readdir(o.dir, function (err, dir) {
      console.log(dir);
    });
  };
};