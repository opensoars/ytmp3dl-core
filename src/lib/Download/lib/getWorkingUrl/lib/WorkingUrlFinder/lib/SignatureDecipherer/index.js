"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');

const ens = require('ens');
const is = require('is');

class SignatureDecipherer {
  constructor(args) {
    this.args = ens.obj(args);
  }
  validateArguments(args) {
    return new Promise((resolve, reject) => {
      if (!is.object(args))
        reject('!is.object(args)');
      else if (!is.object(args.ytplayer_config))
        reject('!is.object(args.ytplayer_config)');
      else if (!is.string(args.signature))
        reject('!is.string(args.signature)');
      else
        resolve(args);
    });
  }
  getJsPlayerFromUrl(url) {
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
  }
  validateJsPlayer(jsplayer) {
    return new Promise((resolve, reject) => {
      if (!is.string(jsplayer))
        reject('!is.string(jsplayer)');
      else if (jsplayer.length < 10000)
        reject('jsplayer.length < 10000');
      else
        resolve(jsplayer);
    });
  }
  getDecipherNameFromJsPlayer(jsplayer, decipher_function_name_re) {
    return new Promise((resolve, reject) => {
      let matches = decipher_function_name_re.exec(jsplayer);
      if (is.array(matches) && matches[1])
        resolve(matches[1]);
      else
        reject('@name is.array(matches) && matches[1] not passed');
    });
  }
  getDecipherArgumentFromJsPlayer(jsplayer, decipher_argument_re) {
    return new Promise((resolve, reject) => {
      let matches = decipher_argument_re.exec(jsplayer);

      if (is.array(matches) && matches[1])
        resolve(matches[1]);
      else
        reject('@argument is.array(matches) && matches[1] not passed');
    });
  }
  getDecipherBodyFromJsPlayer(jsplayer, decipher_function_body_re) {
    return new Promise((resolve, reject) => {
      let matches = decipher_function_body_re.exec(jsplayer);
      if (is.array(matches) && matches[1])
        resolve(matches[1].replace(/\n/gm, ''));
      else
        reject('@body is.array(matches) && matches[1] not passed');
    });
  }
  getDecipherHelpersNameFromBody(body, decipher_helpers_name_re) {
    return new Promise((resolve, reject) => {
      let matches = decipher_helpers_name_re.exec(body);
      if (is.array(matches) && matches[1])
        resolve(matches[1]);
      else
        reject('@helpers name is.array(matches) && matches[1] not passed');
    });
  }
  getDecipherHelpersBodyFromJsplayer(jsplayer, decipher_helpers_body_re) {
    return new Promise((resolve, reject) => {
      let matches = decipher_helpers_body_re.exec(jsplayer);
      if (is.array(matches) && matches[1])
        resolve(matches[1].replace(/\n/gm, ''));
      else
        reject('@helpers body is.array(matches) && matches[1] not passed');
    });
  }
  makeDecipherFunction(args) {
    return new Promise((resolve, reject) => {
      let decipherFunction = new Function(
        [args.decipher_argument],
        `var ${args.decipher_helpers_name}={${args.decipher_helpers_body}};`
        + `${args.decipher_body}`
      );
      resolve(decipherFunction);
    });
  }
  decipherSignature(decipherFunction, signature) {
    return new Promise((resolve, reject) => {
      try {
        let deciphered_signature = decipherFunction(signature);
        resolve(deciphered_signature);
      }
      catch (err) {
        reject(err);
      }
    });
  }
}

SignatureDecipherer.prototype.start = async function start() {
  let t = this;
  try {
    let args = await t.validateArguments(t.args);

    let jsplayer_url = 'https:' + args.ytplayer_config.assets.js;
    let unvalidated_jsplayer = await t.getJsPlayerFromUrl(jsplayer_url);
    let jsplayer = await t.validateJsPlayer(unvalidated_jsplayer);
    let decipher_name = await t.getDecipherNameFromJsPlayer(
      jsplayer, t.regexp.decipher_name
    );
    let decipher_argument = await t.getDecipherArgumentFromJsPlayer(
      jsplayer,
      new RegExp(decipher_name + t.regexp.decipher_argument)
    );
    let decipher_body = await t.getDecipherBodyFromJsPlayer(
      jsplayer, new RegExp(decipher_name + t.regexp.decipher_body)
    );
    let decipher_helpers_name = await t.getDecipherHelpersNameFromBody(
      decipher_body, t.regexp.decipher_helpers_name
    );
    let decipher_helpers_body = await t.getDecipherHelpersBodyFromJsplayer(
      jsplayer,
      new RegExp(decipher_helpers_name + t.regexp.decipher_helpers_body)
    );
    let decipherFunction = await t.makeDecipherFunction({
      decipher_name, decipher_argument, decipher_body,
      decipher_helpers_name, decipher_helpers_body
    });
    let deciphered_signature = await t.decipherSignature(
      decipherFunction,
      args.signature
    );

    t.emit('success', deciphered_signature);
  }
  catch (err) {
    t.emit('error', err);
  }
};

SignatureDecipherer.prototype.regexp = {
  /**
   * Example: (the function call expression gets captured, in this case: sr)
   * sig||e.s){var h = e.sig||sr(
   */
  decipher_name: /sig\|\|.+?\..+?\)\{var.+?\|\|(.+?)\(/,
  /**
   * Captures the first argument name of the decipher function
   * Gets prefixed with decipher name (in this case sr)
   * Example: (a will be captured)
   * sr=function(a){ ... }
   */
  decipher_argument: '=function\\((.+?)\\)\\{[\\w\\W]+?\\}',
  /**
   * 
   */
  decipher_body: '=function\\(.+?\\)\\{([\\w\\W]+?)\\}',
  /**
   * 
   */
  decipher_helpers_name: /;(.+?)\..+?\(.+?\,.+?\);/,
  /**
   * 
   */
  decipher_helpers_body: '=\\{([\\w\\W\\.\\:]+?)\\};'
};


util.inherits(SignatureDecipherer, EventEmitter);

module.exports = SignatureDecipherer;