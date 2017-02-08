"use strict";

const spawn = require('child_process').spawn;

const ffmpegTimeToSec = require('./lib/ffmpegTimeToSec');

module.exports = function convertFile(args) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    const new_file_name = args.temp_dir + '/' + args.file_name + '.mp3';
    const ffmpeg = spawn('ffmpeg', ['-i', args.temp_file_loc, '-f', 'mp3', new_file_name]);

    let total_duration_secs;
    console.log(ffmpeg.stderr);
    ffmpeg.stderr.setEncoding('utf8');
    ffmpeg.stderr.on('data', function (data) {
      //console.log(data.toString());
      // Let's chech for the byte length instead of specific duration: string
      if (data.indexOf('Overwrite ? [y/N]') !== -1) ffmpeg.stdin.write('y\n');else if (data.indexOf('Duration: ') !== -1) {
        let duration_matches = args.duration_re.exec(data.toString());
        if (duration_matches instanceof Array && duration_matches[1]) {
          total_duration_secs = ffmpegTimeToSec(duration_matches[1]);
        } else {
          console.log('heloooooo\n\n\n\n\n');
          //console.log(data.toString());
          console.log('\n\n\n\n\n');
          reject('no duration_matches[1], could not extract total file time');
        }
      } else if (data.indexOf('time=') !== -1) {
        let time_matches = args.time_re.exec(data.toString());
        if (time_matches[1]) {
          _this.emit('conversion-progress', {
            current: ffmpegTimeToSec(time_matches[1]),
            total: total_duration_secs
          });
        } else {
          reject('no time_matches[1], could not extract current conversion time');
        }
      }
    });

    ffmpeg.on('error', function (err) {
      return reject(err);
    });

    ffmpeg.on('close', function (code) {
      if (code === 0) resolve(new_file_name);else reject('ffmpeg exited with code ' + code);
    });
  });
};