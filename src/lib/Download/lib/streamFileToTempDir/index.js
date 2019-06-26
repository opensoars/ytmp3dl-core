"use strict";

const https = require('https');
const fs = require('fs');

module.exports = function streamFileToTempDir(args) {
  return new Promise((resolve, reject) => {
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
    let writeStream = fs.createWriteStream(full_loc)
      .on('error', (err) => endErr('Stream error', err));

    https.get(args.working_url, res => {
      let stream = res.pipe(writeStream);

      progress_interval = setInterval(() => {
        this.emit('stream-progress', {
          bytesWritten: stream.bytesWritten,
          'content-length': res.headers['content-length']
        });
      }, 2000);

      res.on('end', end);
    }).on('error', (err) => endErr('https.get error'));
  });
};
