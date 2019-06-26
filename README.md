# ytmp3dl-core (WIP)

Async YouTube downloader. Utilizing ES6 and ES7 features. ( <3 async await )

This project will be rewritten to use modern features available in recent Node.js releases. Main functionality and project architecture will stay roughly the same. The development of the new `ytmp3dl-core` project will happen simultaneously with the upgrade of the `ytmp3dl-server` project.

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

- `Node.js` (>=10.16.0) + `NPM`
- Globally installed `ffmpeg`

# Use

```js
const Download = require('ytmp3dl-core').Download;

new Download({ v: 'NnTg4vzli5s' })
  .on('callMethod', method => console.log(`callMethod: ${method}`))
  .on('stream-progress', prog => console.log('stream-progress', prog))
  .on('conversion-progress', prog => console.log('conversion-progress', prog))
  .on('error', err => console.log('error', err))
  .on('succes', result => console.log('succes', result))
  .callMethod('start'); 
```


# Up next

* Better `README.md` & examples
* Better logging
* Better error handling more try catch
* Command line interface [ytmp3dl-cli](https://github.com/opensoars/ytmp3dl-cli).
* REST server [ytmp3dl-server](https://github.com/opensoars/ytmp3dl-server) to CRUD (manage) downloads
* Front-end features. Which will be maintained in a new project repo.. More info soon. [ytmp3dl-server](https://github.com/opensoars/ytmp3dl-server) will be used in the process of creating user friendly experiences


# Develop

Previously this project was developed using Babel.js, but since Node.js LTS supports all the features that we were transpiling Babel.js is no longer used. To develop I run `node insta.js`, the `insta.js` file starts downloads when invoked.


# Contributing

1. Fork
2. Create your feature branch (git checkout -b my-epic-feature)
3. Commit your changes (git commit -am 'Add epic feature :)')
4. Push to the branch (git push origin my-epic-feature)
5. Create new Pull Request


# Copyright

Copyright (c) 2019 Sam @ Opensoars. See [LICENSE](https://github.com/opensoars/ezreq/blob/master/LICENSE) for details.
