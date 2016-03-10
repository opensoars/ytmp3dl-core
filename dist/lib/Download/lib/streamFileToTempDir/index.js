"use strict";

const https = require('https');
const fs = require('fs');

module.exports = function streamFileToTempDir(args) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    let full_loc = args.temp_dir + '/' + args.file_name;

    let progress_interval;

    function endErr(err) {
      clearInterval(progress_interval);
      return reject(err);
    }
    let writeStream = fs.createWriteStream(full_loc).on('error', function (err) {
      return endErr('Stream error');
    });

    https.get(args.working_url, function (res) {
      let stream = res.pipe(writeStream);

      progress_interval = setInterval(function () {
        _this.emit('stream-progress', {
          bytesWritten: stream.bytesWritten,
          'content-length': res.headers['content-length']
        });
      }, 500);

      res.on('end', function () {
        clearInterval(progress_interval);
        resolve(full_loc);
      });
    }).on('error', function (err) {
      return endErr('https.get error');
    });
  });
};