var debug = require('debug')('separio:deps')
var npmCheck = require('npm-check')
var npm = require('npm')
var updating = false

module.exports = function checkDeps (manifest, interval, restart) {
  debug('Setting up check once every ' + interval + 'ms')

  setInterval(function () {
    if (updating) return

    debug('Checking dependencies...')

    npmCheck({
      global: false,
      ignoreDev: true
    }).then((state) => {
      var changes = {}

      state.get('packages').forEach((package) => {
        if (package.packageWanted !== package.installed) {
          changes[package.moduleName] = package.packageWanted
        }
      })

      var keys = Object.keys(changes)

      if (!keys.length) {
        debug('All dependencies up-to-date')

        return
      }

      debug('Found ' + keys.length + ' out-of-date dependencies. Updating...')
 
      updating = true

      npm.load(function (err) {
        var packages = keys.map((package) => {
          return (package + '@' + changes[package])
        })

        npm.commands.install(packages, function (err, data) {
          updating = false

          if (err) {
            return console.error(err)
          }

          debug('Updated ' + keys.length + ' packages.')
          debug('Rebooting server...')

          restart()
        })
      })
    })
  }, interval)
}
