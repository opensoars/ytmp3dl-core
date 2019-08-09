'use strict';

module.exports = function getVideoInfoFromYtplayerConfig(ytplayer_config) {
  return new Promise((resolve, reject) => {
    try {
      let ytp_args = JSON.parse(ytplayer_config.args.player_response);

      resolve({
        title: ytp_args.videoDetails.title,
        length_seconds: parseInt(ytp_args.videoDetails.lengthSeconds)
      });
    } catch (err) {
      reject(err);
    }
  });
};
