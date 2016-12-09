var debug = require('debug')('separio:deps')
var david = require('david')
var npmCheck = require('npm-check')
var npm = require('npm')

module.exports = function checkDeps (manifest, interval) {
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

    if (!Object.keys(changes).length) return

    npm.load(function (err) {
      // Instead of doing these one at a time, add them all to the same command!
      Object.keys(changes).forEach((package) => {
        debug('Updating', package, 'to', changes[package])

        npm.commands.install([package + '@' + changes[package]], function (err, data) {
          console.log('oh sit', err, data)
        })
      })
    })
  })
}
