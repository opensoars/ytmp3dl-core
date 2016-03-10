"use strict";

const is = require('is');

function getYtPlayerConfigFromSource(src, ytplayer_config_re) {
  return new Promise((resolve, reject) => {
    if (!is.string(src)) 
      return reject('!is.string(src)');
    else if (!is.regexp(ytplayer_config_re)) 
      return reject('!is.regexp(ytplayer_config_re)');
    
    let ytplayer_config_matches = ytplayer_config_re.exec(src);

    if (is.array(ytplayer_config_matches) && ytplayer_config_matches[1])
      resolve(JSON.parse(ytplayer_config_matches[1]));
    else
      reject('!ytplayer_config_matches');
  });
}

module.exports = getYtPlayerConfigFromSource;