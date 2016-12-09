// var npm = require('npm')
var debug = require('debug')('separio:npm')
var packageJson = require('package-json')

module.exports = function checkNpm (name, currentVersion, searchOperator, interval) {
  var searchVersion = (searchOperator === 'latest') ? 'latest' : (searchOperator + currentVersion)

  setInterval(function () {
    packageJson(name, searchVersion).then(function (data) {
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
