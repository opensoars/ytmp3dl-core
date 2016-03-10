"use strict";

module.exports = function ffmpegTimeToSec(time) {
  let secs = 0;
  
  time.split(':').forEach((count, i) => {
    if (i === 0) secs += parseInt(count * 3600);
    else if (i === 1) secs += parseInt(count * 60);
    else if (i === 2) secs += parseFloat(count);
  });

  return secs;
}