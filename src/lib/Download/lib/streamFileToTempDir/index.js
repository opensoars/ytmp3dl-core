"use strict";

const https = require('https');
const fs = require('fs');

module.exports = function streamFileToTempDir(args) {
  return new Promise((resolve, reject) => {
    try {
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
          const bytesWritten = stream.bytesWritten;
          const contentLength = parseInt(res.headers['content-length']);
          let percentage = bytesWritten / (contentLength / 100);
          if (percentage > 100) percentage = 100;
          this.emit('stream-progress', {
            bytesWritten: bytesWritten,
            bytesTotal: contentLength,
            percentage: percentage
          });
        }, 2000);

        res.on('end', end);
      }).on('error', (err) => endErr('https.get error'));
    }
    catch (err) {
      reject(err);
    }
  });
};
