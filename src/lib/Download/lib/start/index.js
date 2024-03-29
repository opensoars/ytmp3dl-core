'use strict';

module.exports = async function start() {
  let t = this;
  try {
    t.pub.set({
      start: new Date().getTime(),
      completed: false,
      error: false,
      methodsCalled: [],
      errs: []
    });

    t.on('stream-progress', streamProgress => t.pub.set({ streamProgress }));
    t.on('conversion-progress', conversionProgress =>
      t.pub.set({ conversionProgress })
    );
    t.on('callMethod', method => t.pub.methodsCalled.push(method));

    let args = await t.callMethod('validateArguments', t.args);
    let unvalidated_url = await t.callMethod('getUrlFromArguments', args);

    let url = await t.callMethod('validateUrl', unvalidated_url);
    let unvalidated_source = await t.callMethod('getSourceFromUrl', url);
    let source = await t.callMethod('validateSource', unvalidated_source);

    let ytplayer_config = await t.callMethod(
      'getYtPlayerConfigFromSource',
      source,
      t.regexp.ytplayer_config
    );

    // console.log('ytplayer_config', ytplayer_config);

    let video_info = await t.callMethod(
      'getVideoInfoFromYtplayerConfig',
      ytplayer_config
    );

    t.pub.set({ video_info });

    let file_safe_video_title = await t.callMethod(
      'makeStringFileSafe',
      video_info.title
    );
    let fmts = await t.callMethod('getFmtsFromYtplayerConfig', ytplayer_config);
    // console.log('fmts', fmts);

    let ranked_fmts = await t.callMethod('getRankedFmts', fmts);

    // t.pub.set({ ranked_fmts });

    let working_url = await t.callMethod('getWorkingUrl', {
      ranked_fmts,
      ytplayer_config,
      source
    });

    t.pub.set({ working_url });

    let temp_file_loc = await t.callMethod('streamFileToTempDir', {
      working_url,
      temp_dir: this.temp_dir,
      file_name: file_safe_video_title
    });

    // t.pub.set({ temp_file_loc });

    let file_location = await t.callMethod('convertFile', {
      temp_file_loc,
      temp_dir: this.temp_dir,
      file_name: file_safe_video_title,
      duration_re: t.regexp.duration,
      time_re: t.regexp.time,
      file_ext: t.file_ext,
      length_seconds: video_info.length_seconds
    });

    // file_location = file_location.replace(/\.\.mp3$/, '.mp3');
    // file_safe_video_title = file_safe_video_title.replace(/\.\.mp3$/, '.mp3');

    t.pub.set({ file_location, completed: true });

    this.emit('success', {
      file_location,
      file_name: file_safe_video_title,
      file_ext: t.file_ext
    });
  } catch (err) {
    console.log('\n\n\n\nERRRRRR', err, 'dl:', t);

    t.pub.errs.push(err);

    if (this.restartCount < this.maxRestarts) {
      this.restartCount += 1;
      return this.start();
    }

    // if (err === "res.headers['content-length']) >= 5000 not passed") {
    //   console.log('\n\n\nRESTARTING');
    //   return this.start();
    // }

    t.pub.error = true;

    t.emit('error', err);
  }
};
