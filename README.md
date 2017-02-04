# ytmp3dl-core (WIP)

Async YouTube downloader. Utilizing ES6 and ES7 features.

[![Build Status](https://travis-ci.org/opensoars/ytmp3dl-core.svg?branch=master)](https://travis-ci.org/opensoars/ytmp3dl-core)

<!---
[![Coverage Status](https://coveralls.io/repos/opensoars/ytmp3dl-core/badge.svg?branch=master&service=github)](https://coveralls.io/github/opensoars/ytmp3dl-core?branch=master)
[![Inline docs](http://inch-ci.org/github/opensoars/ytmp3dl-core.svg?branch=master)](http://inch-ci.org/github/opensoars/ytmp3dl-core)
[![Codacy Badge](https://api.codacy.com/project/badge/f3e64501763645b9aa483bf83a4dd1d5)](https://www.codacy.com/app/sam_1700/ytmp3dl-core)
[![Code Climate](https://codeclimate.com/github/opensoars/ytmp3dl-core/badges/gpa.svg)](https://codeclimate.com/github/opensoars/ytmp3dl-core)
[![Dependency Status](https://david-dm.org/opensoars/ytmp3dl-core.svg)](https://david-dm.org/opensoars/ytmp3dl-core)
[![devDependency Status](https://david-dm.org/opensoars/ytmp3dl-core/dev-status.svg)](https://david-dm.org/opensoars/ytmp3dl-core#info=devDependencies)
-->

---

New deciphering. To be implemented in src, in a way that [Download/getWorkingUrl/WorkingUrlFinder/SignatureDecipherer](https://github.com/opensoars/ytmp3dl-core/blob/master/src/lib/Download/lib/getWorkingUrl/lib/WorkingUrlFinder/lib/SignatureDecipherer/index.js) will try arrays of regexes . Dist hotfix:

```js
  /**
   *                                                      (..)
   * f.sig?k.set("signature",f.sig):f.s&&k.set("signature",Gm(f.s))
   * (Gm)=function(a){a=a.split("");Fm.uJ(a,2);Fm.iX(a,64);Fm.QS(a,49);Fm.uJ(a,3);return a.join("")};
   * (  )         (.)(.............................................................................)
   */

  /**
   * Example: (the function call expression gets captured, in this case: sr)
   * sig||e.s){var h = e.sig||sr(
   */
  // Old
  //decipher_name: /sig\|\|.+?\..+?\)\{var.+?\|\|(.+?)\(/,
  // New
  decipher_name: /sig\?.+?\&\&.+?\,(.+?)\(/,
```

# Install

`npm install ytmp3dl-core`


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
