"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

module.exports = function () {
  var ref = _asyncToGenerator(function* () {
    let t = this;
    try {
      let a = yield t.callMethod('validateArguments', t.args);
      let unvalidated_url = yield t.callMethod('getUrlFromArguments', a);
      let url = yield t.callMethod('validateUrl', unvalidated_url);
      let unvalidated_source = yield t.callMethod('getSourceFromUrl', url);
      let source = yield t.callMethod('validateSource', unvalidated_source);
      let ytplayer_config = yield t.callMethod('getYtPlayerConfigFromSource', unvalidated_source, t.regexp.ytplayer_config);
      let video_info = yield t.callMethod('getVideoInfoFromYtplayerConfig', ytplayer_config);
      let file_safe_video_title = yield t.callMethod('makeStringFileSafe', video_info.title);
      let fmts = yield t.callMethod('getFmtsFromYtplayerConfig', ytplayer_config);
      let ranked_fmts = yield t.callMethod('getRankedFmts', fmts);
      let working_url = yield t.callMethod('getWorkingUrl', {
        ranked_fmts,
        ytplayer_config
      });
      let temp_file_loc = yield t.callMethod('streamFileToTempDir', {
        working_url,
        temp_dir: this.temp_dir,
        file_name: file_safe_video_title
      });
      let file_location = yield t.callMethod('convertFile', {
        temp_file_loc,
        temp_dir: this.temp_dir,
        file_name: file_safe_video_title,
        duration_re: t.regexp.duration,
        time_re: t.regexp.time,
        file_ext: t.file_ext
      });

      this.emit('success', {
        file_location,
        file_name: file_safe_video_title
      });
    } catch (err) {
      t.emit('error', err);
    }
  });

  return function start() {
    return ref.apply(this, arguments);
  };
}();