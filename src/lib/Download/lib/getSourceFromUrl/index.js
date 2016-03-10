"use strict";

const https = require('https');

const is = require('is');

module.exports = function getSourceFromUrl(url) {
  return new Promise((resolve, reject) => {
    if (!is.string(url)) return reject('is.string(url)');

    https.get(url, res => {
      let source = '';
      res.on('data', chunk => source += chunk);
      res.on('end', () => resolve(source));
    }).on('error', (err) => {
      reject(err);
    });
  });
};