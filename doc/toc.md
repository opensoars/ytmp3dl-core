
```
Preface
  What is the aim of this document?
Introduction
  What is ytdl? Why ytdl? How ytdl?
  Basic how ytdl works (abstract description of app logic)
  Basic reverse engineering description
Application development
  Technology
    Node.js
      Intro / Motivation
    Gulp
      Intro
      babel (build)
      watch
    ES6/ES7
      Why babel and about babel
    Custom unit tests (maybe mocha)
    Travis-ci
      Building the application
      Running the application its unit tests
  Time table
  Releases and feedback
Application design
  Intro
    Modular
    Internal API
    Maintainable
    Extendable
    Asynchronous / multi-core
  ES6/ES7
    Promises
    Asynchronous functions
  Download class
    Intro
    Events
    Modules
      start
      validateArguments
      getUrlFromArguments
      validateUrl
      getSourceFromUrl
      validateSource
      getYtPlayerConfigFromSource
      getVideoInfoFromYtplayerConfig
      getFmtsFromYtplayerConfig
      getRankedFmts
      getWorkingUrl
      streamFileToTempDir
      convertFile
    Flowchart
  WorkingUrlFinder
    Intro
    Events
    Modules
      start
      validateArguments
      validateFmt
      fmtHasSignature
      decipherSignature
      testUrl
    Flowchart
  SignatureDecipherer
    Intro
    Events
    Modules
      start
      validateArguments
      getJsPlayerFromUrl
      validateJsPlayer
      getDecipherNameFromJsPlayer
      getDecipherArgumentFromJsPlayer
      getDecipherBodyFromJsPlayer
      getDecipherHelpersNameFromBody
      getDecipherHelpersBodyFromJsPlayer
      makeDecipherFunction
      decipherSignature
    Flowchart
Node module usage
  Download
  Example(s)
Extensions
  Intro
    How to make an extension etc
  Example(s)
    CLI
    Multi-core downloader
Application maintenance
```
