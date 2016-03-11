"use strict";

const https = require('https');
const fs = require('fs');

module.exports = function streamFileToTempDir(args) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    let full_loc = args.temp_dir + '/' + args.file_name;

    let progress_interval;

    function endErr(err_msg, err) {
      clearInterval(progress_interval);
      reject(err_msg);
    }
    function end() {
      clearInterval(progress_interval);
      resolve(full_loc);
    }
    let writeStream = fs.createWriteStream(full_loc).on('error', function (err) {
      return endErr('Stream error', err);
    });

    https.get(args.working_url, function (res) {
      let stream = res.pipe(writeStream);

      progress_interval = setInterval(function () {
        _this.emit('stream-progress', {
          bytesWritten: stream.bytesWritten,
          'content-length': res.headers['content-length']
        });
      }, 500);

      res.on('end', end);
    }).on('error', function (err) {
      return endErr('https.get error');
    });
  });
};