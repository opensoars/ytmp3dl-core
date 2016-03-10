"use strict";

module.exports = function makeStringFileSafe(str) {
  return new Promise(function (resolve, reject) {
    resolve(str.replace(/\"/g, "'").replace(/:/g, ';').replace(/[\\\/\?\<>\|\*]/g, ''));
  });
};