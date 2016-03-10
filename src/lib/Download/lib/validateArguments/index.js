"use strict";

const is = require('is');

module.exports = function validateArguments(args) {
  return new Promise((resolve, reject) => {
    if (!is.object(args))
      reject('!is.object(args)');
    else if (!args.v && !args.url)  
      reject('!args.v && !args.url');
    else if (!is.string(args.v) && !is.string(args.url))
      reject('!is.string(args.v) && !is.string(args.url)');
    else
      resolve(args);
  });
};

