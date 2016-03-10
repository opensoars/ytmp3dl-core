"use strict";

module.exports = async function start() {
  let t = this;
  try {
    let a = await t.callMethod('validateArguments', t.args)
    let unvalidated_url = await t.callMethod('getUrlFromArguments', a);
    let url = await t.callMethod('validateUrl', unvalidated_url);
    let unvalidated_source = await t.callMethod('getSourceFromUrl', url);
    let source = await t.callMethod('validateSource', unvalidated_source);
    let ytplayer_config = await t.callMethod('getYtPlayerConfigFromSource',
      unvalidated_source,
      t.regexp.ytplayer_config
    );
    let video_info = await t.callMethod('getVideoInfoFromYtplayerConfig',
      ytplayer_config
    );
    let file_safe_video_title = await t.callMethod('makeStringFileSafe',
      video_info.title
    );
    let fmts = await t.callMethod('getFmtsFromYtplayerConfig',
      ytplayer_config
    );
    let ranked_fmts = await t.callMethod('getRankedFmts', fmts);
    let working_url = await t.callMethod('getWorkingUrl', {
      ranked_fmts,
      ytplayer_config
    });
    let temp_file_loc = await t.callMethod('streamFileToTempDir', {
      working_url,
      temp_dir: this.temp_dir,
      file_name: file_safe_video_title
    });
    let file_location = await t.callMethod('convertFile', {
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
  }
  catch (err) {
    t.emit('error', err);
  }
};
