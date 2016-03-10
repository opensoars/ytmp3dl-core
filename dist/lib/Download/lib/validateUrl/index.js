"use strict";

module.exports = function validateUrl(url) {
  return new Promise(function (resolve, reject) {
    let is_valid_url = false;

    let re_t1 = /https\:\/\/www\.youtube\.com\/watch\?v\=.+?/;

    if (re_t1.test(url)) is_valid_url = true;

    is_valid_url ? resolve(url) : reject('Invalid url' + url);
  });
};