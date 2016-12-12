// var npm = require('npm')
var debug = require('debug')('separio:npm')
var packageJson = require('package-json')

module.exports = function checkNpm (name, currentVersion, searchOperator, interval, restart) {
  debug('Setting up check once every ' + interval + 'ms')

  setInterval(function () {
    packageJson(name, searchOperator + currentVersion).then(function (data) {
        if (data.version !== currentVersion) {
          debug('npm checked and needs updating from', currentVersion, 'to', data.version)
        } else {
          debug('npm checked and is on latest version', currentVersion)
        }
    }).catch(function (err) {
      debug(err)
    })
  }, interval)
}
