'use strict';

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');
const querystring = require('querystring');

const ens = require('ens');
const is = require('is');

const SignatureDecipherer = require('./lib/SignatureDecipherer');

const WorkingUrlFinder = class WorkingUrlFinder {
  constructor(args) {
    this.args = ens.obj(args);
  }
  validateArguments(args) {
    return new Promise((resolve, reject) => {
      if (!is.object(args)) reject('!is.object(args)');
      else if (!is.object(args.fmt)) reject('!is.object(args.fmt)');
      else if (!is.object(args.ytplayer_config))
        reject('!is.object(args.ytplayer_config)');
      else resolve(args);
    });
  }
  validateFmt(fmt) {
    return new Promise((resolve, reject) => {
      if (!is.string(fmt.s) && !is.string(fmt.sig) && !is.string(fmt.url))
        reject('No fmt.s || fmt.sig || fmt.url strings present');
      else resolve(fmt);
    });
  }
  fmtHasSignature(fmt) {
    return (
      is.string(fmt.s) || is.string(fmt.sig) || is.string(fmt.signatureCipher)
    );
  }
  decipherSignature(args) {
    args = ens.obj(args);
    return new Promise((resolve, reject) => {
      new SignatureDecipherer({
        ytplayer_config: args.ytplayer_config,
        signature: args.signature
      })
        .on('success', (deciphered_signature) => resolve(deciphered_signature))
        .on('error', (err) => reject(err))
        .start();
    });
  }
  testUrl(url) {
    return new Promise((resolve, reject) => {
      // console.log('testUrlStart');
      https
        .get(url + '&ratebypass=yes&range=0-5000', (res) => {
          // console.log(res.headers);
          res.on('data', () => {
            // console.log('data');
          });
          res.on('end', () => {});
          res.on('close', () => {
            // console.log('\n\n\nCLOSE\n\n\n');
            parseInt(res.headers['content-length']) >= 5000
              ? resolve(url)
              : reject("res.headers['content-length']) >= 5000 not passed");
          });
        })
        .on('error', (err) => reject(err));
    });
  }
};

WorkingUrlFinder.prototype.start = async function start() {
  try {
    let args = await this.validateArguments(this.args);

    // console.log(args);

    // return process.exit();

    // let fmt = await this.validateFmt(args.fmt);
    let fmt = args.fmt;

    // console.log('@WorkingUrlFinder.start', fmt);
    if (fmt.signatureCipher) {
      const queryStringArgs = querystring.parse(fmt.signatureCipher);

      fmt.url = queryStringArgs.url;
      fmt.s = queryStringArgs.s;
    }

    let test_url;
    if (this.fmtHasSignature(fmt)) {
      let deciphered_signature = await this.decipherSignature({
        ytplayer_config: args.ytplayer_config,
        signature: fmt.s || fmt.sig
      });

      // console.log(
      //   '@WorkingUrlFinder.start deciphered_signature',
      //   deciphered_signature
      // );

      test_url = fmt.url + '&sig=' + deciphered_signature;
    } else if (fmt.url) test_url = fmt.url;

    //console.log(working_url);

    // console.log('@workingUrlFinder.start BEFORE testUrl');

    let working_url;

    working_url = await this.testUrl(test_url);

    // await (() =>
    //   new Promise(rs => {
    //     https.get(url + '&ratebypass=yes&range=0-5000', res => {
    //       res.on('data', () => {});
    //       res.on('close', rs);
    //     });
    //   }));

    // console.log('sleep');
    // await (() => new Promise(rs => setTimeout(rs, 3333)))();
    // console.log('sleep done');

    // await (() =>
    //   new Promise(rs => {
    //     https.get(url + '&ratebypass=yes&range=0-5000', res => {
    //       res.on('data', () => {});
    //       res.on('close', rs);
    //     });
    //   }));

    // try {
    //   working_url = await this.testUrl(test_url);
    // } catch (err) {
    //   console.log('inline catch', err);

    //   await (() => new Promise(rs => setTimeout(rs, 1000)))();

    //   working_url = await this.testUrl(test_url);

    //   console.log('working_url', working_url);
    //   process.exit();

    //   //process.exit();
    // }

    // console.log('@workingUrlFinder.start AFTER testUrl');

    //working_url += '&ratebypass=yes';

    working_url += '&range=0-11111111111';

    // console.log('working_url', working_url);
    //working_url = working_url.replace('&sparams=', '&sparams=ratebypass,');

    this.emit('success', working_url);
  } catch (err) {
    // console.log('REJECT');
    this.emit('error', err);
  }
};

[].forEach(
  (module) => (WorkingUrlFinder.prototype[module] = require('./lib/' + module))
);

util.inherits(WorkingUrlFinder, EventEmitter);

module.exports = WorkingUrlFinder;
