var debug = require('debug')('separio:git')
var getPackageJsonFromGithub = require('get-package-json-from-github')
var git = require('simple-git')()

module.exports = function checkGit (remote, branch, interval, restart) {
  debug('Setting up check once every ' + interval + 'ms')

  setInterval(function () {
    // getPackageJsonFromGithub(url).then(function (data) {
    //     if (data.version !== currentVersion) {
    //       debug('Git checked and needs updating from', currentVersion, 'to', data.version)
    //     } else {
    //       debug('Git checked and is on latest version', currentVersion)
    //     }
    // }).catch(function () {
    //   debug('Couldn\'t retrieve package.json for GIT check')
    // })

    git.pull(remote, branch, (err, data) => {
      if (err) {
        return console.error(err)
      }

      if (data.files.length) {
        restart()
      }
    })
  }, interval)
}
