"use strict";

const util = require('util');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const ens = require('ens');
const is = require('is');


let Download = class Download {
  constructor(args) {
    this.args = ens.obj(args);
  }
  writeFile(fn, content, silent) {
    if (!silent) console.log('writeFile', fn);
    return new Promise((resolve, reject) => {
      fs.writeFile(__dirname + '/../../../dump/' + fn, content, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  callMethod(method, ...args) {
    if (!is.string(method))
      throw new Error('callMethod expected method name string as 1st arg');
    else if (!this[method])
      throw new Error(`callMethod could not call method ${method}`);
    this.emit('callMethod', method);
    return this[method].apply(this, args);
  }
  static copyAndClean(args) {
    fs.readFile(args.result_file_location, (err, file) => {
      fs.writeFile(args.dir + '/' + args.file_name, file, err => {
        if (err) console.log(err);
        else console.log('write');
      });
      fs.unlink(args.result_file_location, err => {
        if (err) console.log(err);
        else console.log('unlink mp3');
      });
      fs.unlink(args.result_file_location.replace(args.file_ext, ''), err => {
        if (err) console.log(err);
        else console.log('unlink mp4');
      });
    });
  }
};


[
  'start',
  'validateArguments',
  'getUrlFromArguments',
  'validateUrl',
  'getSourceFromUrl',
  'validateSource',
  'getYtPlayerConfigFromSource',
  'getVideoInfoFromYtplayerConfig',
  'getFmtsFromYtplayerConfig',
  'getRankedFmts',
  'getWorkingUrl',
  'streamFileToTempDir',
  'convertFile',

  'makeStringFileSafe'
].forEach(module => 
  Download.prototype[module] = require('./lib/' + module)
);


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