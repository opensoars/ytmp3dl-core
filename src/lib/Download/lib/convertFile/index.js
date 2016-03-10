"use strict";

const spawn = require('child_process').spawn;

const ffmpegTimeToSec = require('./lib/ffmpegTimeToSec');

module.exports = function convertFile(args) {
  return new Promise((resolve, reject) => {
    const new_file_name = args.temp_dir + '/' + args.file_name + '.mp3';
    const ffmpeg = spawn('ffmpeg', [
      '-i', args.temp_file_loc,
      '-f', 'mp3', new_file_name
    ]);

    let total_duration_secs;

    ffmpeg.stderr.on('data', data => {
      if (data.indexOf('Overwrite ? [y/N]') !== -1) ffmpeg.stdin.write('y\n');
      else if (data.indexOf('Duration: ') !== -1) {
        let duration_matches = args.duration_re.exec(data.toString());
        if (duration_matches[1]) {
          total_duration_secs = ffmpegTimeToSec(duration_matches[1]);
        }
        else {
          reject('no duration_matches[1], could not extract total file time');
        }
      }
      else if (data.indexOf('time=') !== -1) {
        let time_matches = args.time_re.exec(data.toString());
        if (time_matches[1]) {
          this.emit('conversion-progress', {
            current: ffmpegTimeToSec(time_matches[1]),
            total: total_duration_secs
          });
        }
        else {
          reject(
            'no time_matches[1], could not extract current conversion time'
          );
        }
      }
    });

    ffmpeg.on('error', err => reject(err));

    ffmpeg.on('close', code => {
      if (code === 0) resolve(new_file_name);
      else reject('ffmpeg exited with code ' + code);
    });
  });
};