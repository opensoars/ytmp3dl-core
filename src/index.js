"use strict";

const temp_dir = __dirname + '/../temp/';

const ytdl = {};

ytdl.cleanTemp = require('./lib/cleanDir')({ dir: temp_dir });

ytdl.Download = require('./lib/Download');
ytdl.Download.prototype.temp_dir = temp_dir;
ytdl.Download.prototype.file_ext = '.mp3';

module.exports = ytdl;
