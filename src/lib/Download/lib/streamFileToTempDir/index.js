'use strict';

const https = require('https');
const fs = require('fs');

module.exports = function streamFileToTempDir(args) {
  return new Promise((resolve, reject) => {
    try {
      let full_loc = args.temp_dir + '/' + args.file_name;

      let progress_interval;

      function endErr(err_msg, err) {
        clearInterval(progress_interval);
        clearInterval(noDataCheckInterval);
        reject(err_msg);
      }
      function end() {
        clearInterval(progress_interval);
        clearInterval(noDataCheckInterval);

        writeStream.close();

        resolve(full_loc);
      }
      let writeStream = fs
        .createWriteStream(full_loc)
        .on('error', err => endErr('Stream error', err));

      let tries = 0;

      let noDataCheckInterval;

      const get = () => {
        https
          .get(args.working_url, res => {
            tries++;

            if (res.statusCode !== 200 && tries < 5) {
              return get();
            }

            const stream = res.pipe(writeStream);
            const contentLength = parseInt(res.headers['content-length']);
            progress_interval = setInterval(() => {
              let percentage = stream.bytesWritten / (contentLength / 100);
              if (percentage > 100) percentage = 100;
              this.emit('stream-progress', {
                bytesWritten: stream.bytesWritten,
                bytesTotal: contentLength,
                percentage: percentage
              });
            }, 500);

            let lastDataTime = Date.now();

            res.on('data', () => {
              const now = Date.now();
              lastDataTime = now;
            });

            noDataCheckInterval = setInterval(() => {
              if (Date.now() - lastDataTime > 30000) {
                console.log('noDataCheckInterval');
                endErr('noDataCheckInterval: now - lastDataTime > 30000');
              }
            }, 100);

            res.on('end', () => {
              clearInterval(noDataCheckInterval);
              if (stream.bytesWritten === 0) {
                return get();
              }

              this.emit('stream-progress', {
                bytesWritten: stream.bytesWritten,
                bytesTotal: contentLength,
                percentage: 100
              });
              end();
            });
          })
          .on('error', err => endErr('https.get error: ' + err.message));
      };
      get();
    } catch (err) {
      reject(err);
    }
  });
};
