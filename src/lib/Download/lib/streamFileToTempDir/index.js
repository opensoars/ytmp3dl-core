"use strict";

const https = require('https');
const fs = require('fs');

module.exports = function streamFileToTempDir(args) {
  return new Promise((resolve, reject) => {
    let full_loc = args.temp_dir + '/' + args.file_name;

    let writeStream = fs.createWriteStream(full_loc)
      .on('error', (err) => reject('Stream error'));

    https.get(args.working_url, res => {
      let stream = res.pipe(writeStream);

      let progress_interval = setInterval(() => {
        this.emit('stream-progress', {
          bytesWritten: stream.bytesWritten,
          'content-length': res.headers['content-length']
        });
      }, 500);

      res.on('end', () => {
        clearInterval(progress_interval);
        resolve(full_loc);
      });
    }).on('error', (err) => reject('https.get error'));
  });
};