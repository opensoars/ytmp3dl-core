"use strict";

module.exports = function getVideoInfoFromYtplayerConfig(ytplayer_config) {
  return new Promise(function (resolve, reject) {
    let ytp_args = ytplayer_config.args;

    resolve({
      title: ytp_args.title
    });
  });
};