"use strict";

module.exports = function getVideoInfoFromYtplayerConfig(ytplayer_config) {
  return new Promise((resolve, reject) => {
    let ytp_args = ytplayer_config.args;

    resolve({
      title: ytp_args.title
    });
  });
};