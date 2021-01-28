# sqlite3-lite
this zero-dependency package will provide pre-built version of node-sqlite3 (v5.0.0)

# live web demo
- none


[![travis-ci.com build-status](https://api.travis-ci.com/kaizhu256/node-sqlite3-lite.svg)](https://travis-ci.com/kaizhu256/node-sqlite3-lite) [![coverage](https://kaizhu256.github.io/node-sqlite3-lite/build/coverage/coverage.badge.svg)](https://kaizhu256.github.io/node-sqlite3-lite/build/coverage/index.html)

[![NPM](https://nodei.co/npm/sqlite3-lite.png?downloads=true)](https://www.npmjs.com/package/sqlite3-lite)

[![build commit status](https://kaizhu256.github.io/node-sqlite3-lite/build/build.badge.svg)](https://travis-ci.com/kaizhu256/node-sqlite3-lite)

| git-branch : | [master](https://github.com/kaizhu256/node-sqlite3-lite/tree/master) | [beta](https://github.com/kaizhu256/node-sqlite3-lite/tree/beta) | [alpha](https://github.com/kaizhu256/node-sqlite3-lite/tree/alpha)|
|--:|:--|:--|:--|
| test-report : | [![test-report](https://kaizhu256.github.io/node-sqlite3-lite/build..master..travis-ci.com/test-report.badge.svg)](https://kaizhu256.github.io/node-sqlite3-lite/build..master..travis-ci.com/test-report.html) | [![test-report](https://kaizhu256.github.io/node-sqlite3-lite/build..beta..travis-ci.com/test-report.badge.svg)](https://kaizhu256.github.io/node-sqlite3-lite/build..beta..travis-ci.com/test-report.html) | [![test-report](https://kaizhu256.github.io/node-sqlite3-lite/build..alpha..travis-ci.com/test-report.badge.svg)](https://kaizhu256.github.io/node-sqlite3-lite/build..alpha..travis-ci.com/test-report.html)|
| coverage : | [![coverage](https://kaizhu256.github.io/node-sqlite3-lite/build..master..travis-ci.com/coverage/coverage.badge.svg)](https://kaizhu256.github.io/node-sqlite3-lite/build..master..travis-ci.com/coverage/index.html) | [![coverage](https://kaizhu256.github.io/node-sqlite3-lite/build..beta..travis-ci.com/coverage/coverage.badge.svg)](https://kaizhu256.github.io/node-sqlite3-lite/build..beta..travis-ci.com/coverage/index.html) | [![coverage](https://kaizhu256.github.io/node-sqlite3-lite/build..alpha..travis-ci.com/coverage/coverage.badge.svg)](https://kaizhu256.github.io/node-sqlite3-lite/build..alpha..travis-ci.com/coverage/index.html)|
| build-artifacts : | [![build-artifacts](https://kaizhu256.github.io/node-sqlite3-lite/glyphicons_144_folder_open.png)](https://github.com/kaizhu256/node-sqlite3-lite/tree/gh-pages/build..master..travis-ci.com) | [![build-artifacts](https://kaizhu256.github.io/node-sqlite3-lite/glyphicons_144_folder_open.png)](https://github.com/kaizhu256/node-sqlite3-lite/tree/gh-pages/build..beta..travis-ci.com) | [![build-artifacts](https://kaizhu256.github.io/node-sqlite3-lite/glyphicons_144_folder_open.png)](https://github.com/kaizhu256/node-sqlite3-lite/tree/gh-pages/build..alpha..travis-ci.com)|

[![npmPackageListing](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.npmPackageListing.svg)](https://github.com/kaizhu256/node-sqlite3-lite)

![npmPackageDependencyTree](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.npmPackageDependencyTree.svg)


# table of contents
1. [cdn download](#cdn-download)
1. [documentation](#documentation)
1. [quickstart example.js](#quickstart-examplejs)
1. [extra screenshots](#extra-screenshots)
1. [package.json](#packagejson)
1. [changelog of last 50 commits](#changelog-of-last-50-commits)
1. [internal build script](#internal-build-script)
1. [misc](#misc)


# cdn download
- none


# documentation
#### api doc
- [https://kaizhu256.github.io/node-sqlite3-lite/build..beta..travis-ci.com/apidoc.html](https://kaizhu256.github.io/node-sqlite3-lite/build..beta..travis-ci.com/apidoc.html)

[![apidoc](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Fapidoc.html.png)](https://kaizhu256.github.io/node-sqlite3-lite/build..beta..travis-ci.com/apidoc.html)

#### cli help
![screenshot](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.npmPackageCliHelp.svg)

#### changelog 2020.8.19
- include trace
- update build
- none

#### todo
- none


# quickstart example.js

#### to run this example, follow instruction in script below
- [example.js](https://kaizhu256.github.io/node-sqlite3-lite/build..beta..travis-ci.com/example.js)
```javascript
/*
example.js

this script will run node-demo of sqlite3-lite

instruction
    1. save this script as example.js
    2. run shell-command:
        $ npm install sqlite3-lite && \
            PORT=8081 node example.js
    3. edit this script to suit your needs
*/


/* istanbul instrument in package sqlite3 */
/* jslint utility2:true */
/* istanbul ignore next */
// run shared js-env code - init-local
(function () {
    "use strict";
    let db;
    let sqlite3;
    sqlite3 = (
        globalThis.utility2_rollup
        || globalThis.utility2_jslint
        || require("sqlite3-lite")
    );
    db = new sqlite3.Database(":memory:");
    db.serialize(function () {
        let ii;
        let stmt;
        db.run("CREATE TABLE lorem (info TEXT)");
        stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        ii = 0;
        while (ii < 10) {
            stmt.run("Ipsum " + ii);
            ii += 1;
        }
        stmt.finalize();
        db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
            if (err) {
                throw err;
            }
            console.log(row.id + ": " + row.info);
        });
    });
    db.close();
}());
```

#### output from shell
![screenshot](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.testExampleJs.svg)


# extra screenshots
1. [https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Fapidoc.html.png](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Fapidoc.html.png)
[![screenshot](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Fapidoc.html.png)](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Fapidoc.html.png)

1. [https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Fcoverage.lib.html.png](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Fcoverage.lib.html.png)
[![screenshot](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Fcoverage.lib.html.png)](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Fcoverage.lib.html.png)

1. [https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Ftest-report.html.png](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Ftest-report.html.png)
[![screenshot](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Ftest-report.html.png)](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.buildCi.browser.%252F.tmp%252Fbuild%252Ftest-report.html.png)


# package.json
```json
{
    "!!jslint_utility2": true,
    "author": "kai zhu <kaizhu256@gmail.com>",
    "description": "this zero-dependency package will provide pre-built version of node-sqlite3 (v5.0.0)",
    "devDependencies": {
        "utility2": "kaizhu256/node-utility2#alpha"
    },
    "engines": {
        "node": ">=12.0"
    },
    "fileCount": 8,
    "homepage": "https://github.com/kaizhu256/node-sqlite3-lite",
    "keywords": [
        "sql",
        "sqlite",
        "sqlite3",
        "database"
    ],
    "license": "MIT",
    "main": "lib.sqlite3.js",
    "name": "sqlite3-lite",
    "nameAliasPublish": "",
    "nameLib": "sqlite3",
    "nameOriginal": "sqlite3-lite",
    "repository": {
        "type": "git",
        "url": "https://github.com/kaizhu256/node-sqlite3-lite.git"
    },
    "scripts": {
        "build-ci": "./npm_scripts.sh",
        "env": "env",
        "eval": "./npm_scripts.sh",
        "heroku-postbuild": "./npm_scripts.sh",
        "postinstall": "./npm_scripts.sh",
        "start": "./npm_scripts.sh",
        "test": "./npm_scripts.sh",
        "utility2": "./npm_scripts.sh"
    },
    "version": "2020.8.19"
}
```


# changelog of last 50 commits
[![screenshot](https://kaizhu256.github.io/node-sqlite3-lite/build/screenshot.gitLog.svg)](https://github.com/kaizhu256/node-sqlite3-lite/commits)


# internal build script
- build_ci.sh
```shell
# build_ci.sh

# this shell script will run build-ci for this package

shBuildCiAfter () {(set -e
    shDeployCustom
    # shDeployGithub
    # shDeployHeroku
    shReadmeTest example.sh
)}

shBuildCiBefore () {(set -e
    shNpmTestPublished
    shReadmeTest example.js
)}

# run shBuildCi
eval "$(utility2 source)"
shBuildCi
```


# misc
- this package was created with [utility2](https://github.com/kaizhu256/node-utility2)
