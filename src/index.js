"use strict";

const ytdl = {};

let Download = require('./lib/Download');


Download.prototype.temp_dir = __dirname + '/../temp';
Download.prototype.file_ext = '.mp3';


ytdl.Download = Download;

module.exports = ytdl;