"use strict";

const is = require('is');
const fs = require('fs');

function getYtPlayerConfigFromSource(src, ytplayer_config_re) {
  return new Promise((resolve, reject) => {
    try {
      if (!is.string(src)) 
        return reject('!is.string(src)');
      else if (!is.regexp(ytplayer_config_re)) 
        return reject('!is.regexp(ytplayer_config_re)');
      
      let ytplayer_config_matches = ytplayer_config_re.exec(src);

      // fs.writeFileSync('/home/s/dev/outs/player.html', src);

      // console.log(ytplayer_config_re);

      // process.exit();
      

      if (true || is.array(ytplayer_config_matches) && ytplayer_config_matches[1])
        resolve(JSON.parse(ytplayer_config_matches[1]));
      else
        reject('!ytplayer_config_matches');
    }
    catch (err) {
      reject(err);
    }
  });
}

module.exports = getYtPlayerConfigFromSource;