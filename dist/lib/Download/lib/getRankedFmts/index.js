"use strict";

const ens = require('ens');
const is = require('is');

module.exports = function getRankedFmts(fmts) {
  fmts = ens.arr(fmts);
  return new Promise(function (resolve, reject) {
    if (fmts.length === 0) return reject('fmts.length === 0');

    fmts.sort(function (a, b) {
      let a_i = a.type.indexOf('audio');
      let b_i = b.type.indexOf('audio');
      if (a_i < b_i) return 1;
      if (a_i >= b_i) return -1;
      return 0;
    });
    fmts.sort(function (a, b) {
      let a_i = a.type.indexOf('audio/mp4');
      let b_i = b.type.indexOf('audio/mp4');
      if (a_i < b_i) return 1;
      if (a_i >= b_i) return -1;
      return 0;
    });
    // @TODO sort for best bitrate?
    resolve(fmts);
  });
};