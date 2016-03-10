"use strict";

const https = require('https');

const is = require('is');

module.exports = function getSourceFromUrl(url) {
  return new Promise(function (resolve, reject) {
    if (!is.string(url)) return reject('is.string(url)');

    https.get(url, function (res) {
      let source = '';
      res.on('data', function (chunk) {
        return source += chunk;
      });
      res.on('end', function () {
        return resolve(source);
      });
    }).on('error', function (err) {
      reject(err);
    });
  });
};