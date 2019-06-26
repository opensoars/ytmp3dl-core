"use strict";

module.exports = function getVideoInfoFromYtplayerConfig(ytplayer_config) {
  return new Promise((resolve, reject) => {
    try {
      let ytp_args = ytplayer_config.args;

      resolve({
        title: ytp_args.title,
        length_seconds: parseInt(ytp_args.length_seconds)
      });
    }
    catch (err) {
      reject(err);
    }
  });
};