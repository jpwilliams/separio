var debug = require('debug')('separio:git')
var getPackageJsonFromGithub = require('get-package-json-from-github')
var git = require('simple-git')()
var npm = require('npm')

module.exports = function checkGit (remote, branch, interval, restart) {
  debug('Setting up check once every ' + interval + 'ms')

  setInterval(function () {
    debug('Checking we have the latest code from ' + remote + '/' + branch + '...')

    git.pull(remote, branch, (err, data) => {
      if (err) {
        return console.error(err)
      }

      if (data.files.length) {
        debug('Pulled new code!')

        return npm.load(function (err) {
          debug('Updating any dependencies...')

          npm.commands.install([], function (err, data) {
            if (err) {
              return console.error(err)
            }

            debug('Rebooting server...')

            restart()
          })
        })
      }

      debug('Code already up-to-date')
    })
  }, interval)
}
