const debug = require('debug')('separio:deps')
const npmCheck = require('npm-check')
const npm = require('npm')
let updating = false

module.exports = function checkDeps (manifest, interval, restart) {
  debug('Setting up check once every ' + interval + 'ms')

  setInterval(function () {
    if (updating) return

    debug('Checking dependencies...')

    npmCheck({
      global: false,
      ignoreDev: true
    }).then((state) => {
      let packagesToInstall = []

      state.get('packages').forEach((pack) => {
        if (pack.packageWanted && pack.packageWanted !== pack.installed) {
          packagesToInstall.push(`${pack.moduleName}@${pack.packageWanted}`)
        }
      })

      if (!packagesToInstall.length) {
        debug('All dependencies up-to-date')

        return
      }

      debug(`Found ${packagesToInstall.length} out-of-date dependencies. Updating...`)

      updating = true

      npm.load((err) => {
        if (err) {
          updating = false

          return console.error(err)
        }

        npm.commands.install(packagesToInstall.join(' '), (err, data) => {
          updating = false

          if (err) {
            return console.error(err)
          }

          debug(`Updated ${packagesToInstall.length} packages.`)
          debug(`Rebooting server...`)

          restart()
        })
      })
    })
  }, interval)
}
