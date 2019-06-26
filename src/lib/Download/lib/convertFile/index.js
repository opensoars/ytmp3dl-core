"use strict";

const spawn = require('child_process').spawn;

const ffmpegTimeToSec = require('./lib/ffmpegTimeToSec');

module.exports = function convertFile(args) {
  return new Promise((resolve, reject) => {
    try {
      const new_file_name = args.temp_dir + '/' + args.file_name + '.mp3';
      const ffmpeg = spawn('ffmpeg', [
        '-y',
        '-i', args.temp_file_loc,
        '-f', 'mp3', new_file_name
      ]);

      let total_duration_secs = args.length_seconds;
      //console.log(ffmpeg.stderr);
      ffmpeg.stderr.setEncoding('utf8');
      ffmpeg.stderr.on('data', data => {
        //console.log(data.toString());

        //console.log('DATA', data.toString());
        // Let's chech for the byte length instead of specific duration: string
        if (data.indexOf('Overwrite ? [y/N]') !== -1) ffmpeg.stdin.write('y\n');
/*        else if (data.indexOf('Duration: ') !== -1) {
          let duration_matches = args.duration_re.exec(data.toString());
          if (duration_matches instanceof Array && duration_matches[1]) {
            total_duration_secs = ffmpegTimeToSec(duration_matches[1]);
          }
          else {
            console.log('heloooooo\n\n\n\n\n');
            //console.log(data.toString());
            console.log('\n\n\n\n\n');
            console.log(data.toString());
            console.log('\n\n\n\n\n');
            reject('no duration_matches[1], could not extract total file time');
          }
        }*/
        else if (data.indexOf('time=') !== -1) {
          let time_matches = args.time_re.exec(data.toString());
          if (time_matches[1]) {
            const current = ffmpegTimeToSec(time_matches[1]);
            const total = total_duration_secs;
            let percentage = current / (total / 100);
            if (percentage > 100) percentage = 100;
            this.emit('conversion-progress', {
              current: ffmpegTimeToSec(time_matches[1]),
              total: total_duration_secs,
              percentage: percentage
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
    }
    catch (err) {
      reject(err);
    }
  });
};
