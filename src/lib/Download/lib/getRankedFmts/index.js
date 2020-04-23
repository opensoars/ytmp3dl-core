'use strict';

const ens = require('ens');
const is = require('is');

module.exports = function getRankedFmts(fmts) {
  fmts = ens.arr(fmts);
  return new Promise((resolve, reject) => {
    try {
      if (fmts.length === 0) return reject('fmts.length === 0');

      const webmFmts = [];
      const mp4Fmts = [];
      const vidFmts = [];

      fmts.forEach(fmt => {
        if (fmt.mimeType.indexOf('audio/webm') !== -1) webmFmts.push(fmt);
        else if (fmt.mimeType.indexOf('audio/mp4') !== -1) mp4Fmts.push(fmt);
        else vidFmts.push(fmt);
      });

      const bitrateSorter = (a, b) => {
        if (parseInt(a.bitrate) < parseInt(b.bitrate)) return 1;
        if (parseInt(a.bitrate) >= parseInt(b.bitrate)) return -1;
        return 0;
      };

      webmFmts.sort(bitrateSorter);
      mp4Fmts.sort(bitrateSorter);
      vidFmts.sort(bitrateSorter);

      let sortedFmts = [...webmFmts, ...mp4Fmts, ...vidFmts];

      sortedFmts = sortedFmts.filter(
        fmt => fmt.mimeType.indexOf('video') === -1
      );
      // console.log(sortedFmts);

      resolve(sortedFmts);
    } catch (err) {
      reject(err);
    }
  });
};
