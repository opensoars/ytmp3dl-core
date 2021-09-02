'use strict';

const fs = require('fs');

module.exports = function getVideoInfoFromYtplayerConfig(ytplayer_config) {
  return new Promise((resolve, reject) => {
    try {
      // fs.writeFileSync(
      //   '/home/s/dev/outs/ytplayer_config.json',
      //   JSON.stringify(ytplayer_config, null, 2)
      // );
      // let ytp_args = JSON.parse(ytplayer_config);

      resolve({
        title: ytplayer_config.videoDetails.title,
        length_seconds: parseInt(ytplayer_config.videoDetails.lengthSeconds)
      });
    } catch (err) {
      reject(err);
    }
  });
};
