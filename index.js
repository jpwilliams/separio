// David for checks deps
// NPM for checking package status (current version against latest version)
// Git for checking package status from there? Track a specific branch? All in the URL?
var debug = require('debug')('separio')
var manifest = require(require('path').resolve('package.json'))
var checkNpm = require('./lib/checks/npm')
var checkGit = require('./lib/checks/git')
var checkDeps = require('./lib/checks/deps')

module.exports = function separio (options) {
  options = options || {}

  if (options.npm) {
    if (['^', '~', 'latest'].indexOf(options.npm) < 0) {
      throw new Error('Invalid NPM check given; must be one of either "^", "~"" or "latest"')
    }

    debug()

    checkNpm(manifest.name, manifest.version, options.npm, 1000)
  }

  if (options.git) {
    checkGit(options.git, manifest.version, 1000)
  }

  if (options.deps) {
    checkDeps(manifest, 1000)
  }
}
