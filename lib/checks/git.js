var debug = require('debug')('separio:git')
var git = require('simple-git')()
var npm = require('npm')

module.exports = function checkGit (remote, branch, hard, interval, restart) {
  debug('Setting up check once every ' + interval + 'ms')

  var resetSettings = [remote + '/' + branch]
  if (hard) resetSettings = ['--hard'].concat(resetSettings)

  setInterval(function () {
    debug('Checking we have the latest code from ' + remote + '/' + branch + '...')

    // Hard: Fetch origin/master -> Reset origin/master
    // Soft: Pull origin/master
    git.pull(remote, branch, (err, update) => {
      if (err) {
        return console.error(err)
      }

      if (update && update.summary.changes) {
        debug('Pulled ' + update.summary.changes + ' new changes')

        debug(update.summary.changes)

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
