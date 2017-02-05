# ytmp3dl-core (WIP)

Async YouTube downloader. Utilizing ES6 and ES7 features.

[![Build Status](https://travis-ci.org/opensoars/ytmp3dl-core.svg?branch=master)](https://travis-ci.org/opensoars/ytmp3dl-core)

<!---
[![Coverage Status](https://coveralls.io/repos/opensoars/ytmp3dl-core/badge.svg?branch=master&service=github)](https://coveralls.io/github/opensoars/ytmp3dl-core?branch=master)
[![Inline docs](http://inch-ci.org/github/opensoars/ytmp3dl-core.svg?branch=master)](http://inch-ci.org/github/opensoars/ytmp3dl-core)
[![Codacy Badge](https://api.codacy.com/project/badge/f3e64501763645b9aa483bf83a4dd1d5)](https://www.codacy.com/app/sam_1700/ytmp3dl-core)
[![Code Climate](https://codeclimate.com/github/opensoars/ytmp3dl-core/badges/gpa.svg)](https://codeclimate.com/github/opensoars/ytmp3dl-core)
-->

---


# Install

`npm install ytmp3dl-core`


# Requirements

## ffmpeg

`sudo apt-get install ffmpeg`.


# Use

```js
new (require('ytmp3dl-core').Download)({ v: 'NnTg4vzli5s' })
  .on('callMethod', method => console.log(`callMethod: ${method}`))
  .on('stream-progress', prog => console.log('stream-progress', prog))
  .on('conversion-progress', prog => console.log('conversion-progress', prog))
  .on('error', err => console.log('error', err))
  .on('succes', result => console.log('succes', result))
  .callMethod('start'); 
```


# Develop

Run `npm run gulp-babel` to compile the source code. Run `npm run gulp-watch` to run the `gulp-babel` npm command on file change. Of course `gulp babel` and `gulp watch` can be used when gulp is locally installed.


# Contributing

1. Fork
2. Create your feature branch (git checkout -b my-epic-feature)
3. Commit your changes (git commit -am 'Add epic feature :)')
4. Push to the branch (git push origin my-epic-feature)
5. Create new Pull Request


# Copyright

Copyright (c) 2017 Sam @ Opensoars. See [LICENSE](https://github.com/opensoars/ezreq/blob/master/LICENSE) for details.