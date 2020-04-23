'use strict';

const ens = require('ens');
const is = require('is');
const querystring = require('querystring');

module.exports = function getFmtsFromYtplayerConfig(ytplayer_config) {
  ytplayer_config = ens.obj(ytplayer_config);
  return new Promise((resolve, reject) => {
    try {
      if (!ytplayer_config.args) return reject('!ytplayer_config.args');

      let newFmts = JSON.parse(ytplayer_config.args.player_response)
        .streamingData.adaptiveFormats;

      // else if (!is.string(ytplayer_config.args.adaptive_fmts))
      //   return reject('!is.string(ytplayer_config.args.adaptive_fmts)');

      // let fmts = [];
      // let adaptive_fmts_string = ytplayer_config.args.adaptive_fmts;
      // let split_adaptive_fmt_strings = adaptive_fmts_string.split(',');

      // split_adaptive_fmt_strings.forEach(adaptive_fmt_string => {
      //   fmts.push(querystring.decode(adaptive_fmt_string));
      // });

      // console.log('\n\n\n\n\n\n\n\n\n\n', newFmts);

      newFmts.forEach(fmt => {
        // console.log(fmt);

        if (fmt.cipher) {
          const obj = querystring.decode(fmt.cipher);
          fmt.url = obj.url;
          fmt.s = obj.s;
          fmt.sp = obj.sp;
        }
      });

      // console.log('\n\n\n\n\n\n\n\n\n\n', newFmts);

      // console.log(newFmts);

      resolve(newFmts);
    } catch (err) {
      reject(err);
    }
  });
};
