"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');

const ens = require('ens');
const is = require('is');

const SignatureDecipherer = require('./lib/SignatureDecipherer');

const WorkingUrlFinder = class WorkingUrlFinder {
  constructor(args) {
    this.args = ens.obj(args);
  }
  validateArguments(args) {
    return new Promise(function (resolve, reject) {
      if (!is.object(args)) reject('!is.object(args)');else if (!is.object(args.fmt)) reject('!is.object(args.fmt)');else if (!is.object(args.ytplayer_config)) reject('!is.object(args.ytplayer_config)');else resolve(args);
    });
  }
  validateFmt(fmt) {
    return new Promise(function (resolve, reject) {
      if (!is.string(fmt.s) && !is.string(fmt.sig) && !is.string(fmt.url)) reject('No fmt.s || fmt.sig || fmt.url strings present');else resolve(fmt);
    });
  }
  fmtHasSignature(fmt) {
    return is.string(fmt.s) || is.string(fmt.sig);
  }
  decipherSignature(args) {
    args = ens.obj(args);
    return new Promise(function (resolve, reject) {
      new SignatureDecipherer({
        ytplayer_config: args.ytplayer_config,
        signature: args.signature
      }).on('success', function (deciphered_signature) {
        return resolve(deciphered_signature);
      }).on('error', function (err) {
        return reject(err);
      }).start();
    });
  }
  testUrl(url) {
    return new Promise(function (resolve, reject) {
      https.get(url + '&ratebypass=yes&range=0-1', function (res) {
        res.on('data', function () {});
        res.on('end', function () {
          parseInt(res.headers['content-length']) === 2 ? resolve(url) : reject("res.headers['content-length']) === 2 not passed");
        });
      }).on('error', function (err) {
        return reject(err);
      });
    });
  }
};

WorkingUrlFinder.prototype.start = function () {
  var ref = _asyncToGenerator(function* () {
    try {
      let args = yield this.validateArguments(this.args);
      let fmt = yield this.validateFmt(args.fmt);

      let test_url;
      if (this.fmtHasSignature(fmt)) {
        let deciphered_signature = yield this.decipherSignature({
          ytplayer_config: args.ytplayer_config,
          signature: fmt.s || fmt.sig
        });
        test_url = fmt.url + '&signature=' + deciphered_signature;
      } else if (fmt.url) test_url = fmt.url;

      let working_url = yield this.testUrl(test_url);
      this.emit('success', working_url + '&ratebypass=yes');
    } catch (err) {
      this.emit('error', err);
    }
  });

  return function start() {
    return ref.apply(this, arguments);
  };
}();

[].forEach(function (module) {
  return WorkingUrlFinder.prototype[module] = require('./lib/' + module);
});

util.inherits(WorkingUrlFinder, EventEmitter);

module.exports = WorkingUrlFinder;