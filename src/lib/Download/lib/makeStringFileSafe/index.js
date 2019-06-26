"use strict";

module.exports = function makeStringFileSafe(str) {
  return new Promise((resolve, reject) => {
    try {
      resolve(str
        .replace(/\"/g, "'")
        .replace(/:/g, ';')
        .replace(/[\\\/\?\<>\|\*]/g, '')
      );
    }
    catch (err) {
      reject(err);
    }
  });
};