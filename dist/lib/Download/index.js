"use strict";

const util = require('util');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const ens = require('ens');
const is = require('is');

let Download = class Download {
  constructor(args) {
    this.args = ens.obj(args);
    //this.initPub();
  }
  writeFile(fn, content, silent) {
    if (!silent) console.log('writeFile', fn);
    return new Promise(function (resolve, reject) {
      fs.writeFile(__dirname + '/../../../dump/' + fn, content, function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  callMethod(method) {
    if (!is.string(method)) throw new Error('callMethod expected method name string as 1st arg');else if (!this[method]) throw new Error(`callMethod could not call method ${ method }`);
    this.emit('callMethod', method);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this[method].apply(this, args);
  }
  static copyAndClean(args) {
    fs.readFile(args.result_file_location, function (err, file) {
      fs.writeFile(args.dir + '/' + args.file_name, file, function (err) {
        if (err) throw err;
      });
      fs.unlink(args.result_file_location, function (err) {
        if (err) throw err;
      });
      fs.unlink(args.result_file_location.replace(args.file_ext, ''), function (err) {
        if (err) throw err;
      });
    });
  }
};

Download.prototype.initPub = function () {
  this.pub = {
    d: {}
  };
  this.pub.get = function (key) {
    if (!key) return this.d;
    return this.d[key];
  };
  this.pub.set = function () {
    if (is.object(arguments[0])) for (let key in arguments[0]) if (arguments[0].hasOwnProperty(key)) this.d[key] = arguments[0][key];
    if (is.string(arguments[0]) && arguments[1]) this.d[arguments[0]] = arguments[1];

    return this;
  };
  this.pub.del = function () {
    var _this = this;

    if (is.string(arguments[0])) delete this.d[arguments[0]];else if (is.array(arguments[0])) arguments[0].forEach(function (el) {
      return delete _this.d[el];
    });

    return this;
  };
};

['start', 'validateArguments', 'getUrlFromArguments', 'validateUrl', 'getSourceFromUrl', 'validateSource', 'getYtPlayerConfigFromSource', 'getVideoInfoFromYtplayerConfig', 'getFmtsFromYtplayerConfig', 'getRankedFmts', 'getWorkingUrl', 'streamFileToTempDir', 'convertFile', 'makeStringFileSafe'].forEach(function (module) {
  return Download.prototype[module] = require('./lib/' + module);
});

/** Set Download prototype properties */

Download.prototype.regexp = {
  /**
   * Captures the ytplayer object, the pattern used is simple:
   *  <script>.+?ytplayer.config.+?=.+?
   * This matches a script containing a statement which assigns the
   * ytplayer.config property.
   *  (\{.+?\});
   * This matches and captures the object that is getting assigned to the
   * ytplayer its config property. This works because of the fact that the
   * assignment statement is closed by these two characters };
   *  .+?;<\/script>
   * Allow as much character matches as needed till the closing
   * script tag is found
   * Example (everything between the parentheses is captured)
   * <script> ... ytplayer.config = ({ ... }); ... ;</script>
   */
  ytplayer_config: /<script>.+?ytplayer.config.+?=.+?(\{.+?\});.+?;<\/script>/,

  /**
   * Example (everything between the parentheses is captured)
   * ... Duration: (00:00:00.00),
   */
  duration: /Duration: (.+?),/,

  /**
   * Note the trailing space.
   * Example (everything between the parentheses is captured)
   * ... time=(00:00:00.00) 
   */
  time: /time=(.+?) /
};

util.inherits(Download, EventEmitter);

module.exports = Download;