'use strict';

const ens = require('ens');

const WorkingUrlFinder = require('./lib/WorkingUrlFinder');

module.exports = function getWorkingUrl(args) {
  args = ens.obj(args);

  return new Promise((resolve, reject) => {
    let ranked_fmts = args.ranked_fmts;
    let ytplayer_config = args.ytplayer_config;

    let attempt_i = 0;
    (function attemptWorkIngUrlFinder(err) {
      // console.log(attempt_i, ranked_fmts.length);
      if (attempt_i === ranked_fmts.length) return reject(err);
      let attempt = new WorkingUrlFinder({
        fmt: ranked_fmts[attempt_i],
        ytplayer_config,
        source: args.source
      });
      attempt.on('error', err => attemptWorkIngUrlFinder(err));
      attempt.on('success', working_url =>
        resolve(working_url + '&ratebypass=yes')
      );
      attempt_i++;
      attempt.start();
    })();
  });
};
