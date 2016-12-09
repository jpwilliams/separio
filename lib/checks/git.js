var debug = require('debug')('separio:git')
var getPackageJsonFromGithub = require('get-package-json-from-github')

module.exports = function checkGit (url, currentVersion, interval) {
  setInterval(function () {
    getPackageJsonFromGithub(url).then(function (data) {
        if (data.version !== currentVersion) {
          debug('Git checked and needs updating from', currentVersion, 'to', data.version)
        } else {
          debug('Git checked and is on latest version', currentVersion)
        }
    }).catch(function () {
      debug('Couldn\'t retrieve package.json for GIT check')
    })
  }, interval)
}
