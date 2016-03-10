"use strict";

const is = require('is');

module.exports = function getUrlFromArguments(args) {
  return new Promise((resolve, reject) => {
    if (is.string(args.url))
      resolve(args.url);
    else if (is.string(args.v))
      resolve('https://www.youtube.com/watch?v=' + args.v);
    else
      reject('!args.url && !args.v');
  });
};
