// David for checks deps
// NPM for checking package status (current version against latest version)
// Git for checking package status from there? Track a specific branch? All in the URL?
var debug = require('debug')('separio')
var manifest = require(require('path').resolve('package.json'))
var checkNpm = require('./lib/checks/npm')
var checkGit = require('./lib/checks/git')
var checkDeps = require('./lib/checks/deps')
var optionsSchema = require('./lib/optionsSchema')
var joi = require('joi')

module.exports = function separio (options) {
  options = options || {}

  const validation = joi.validate(options, optionsSchema, {
    stripUnknown: true
  })

  if (validation.error) throw validation.error

  options = validation.value

  if (!options.restart) {
    debug('WARNING: No custom restart function provided')

    options.restart = (() => {
      debug('Rebooting')
      process.kill(process.pid, process.env.RESTART_SIGNAL || 'SIGUSR2')
    })
  }

  if (options.npm && options.npm.enabled) {
    if (options.npm.range === 'latest') options.npm.range = '*'

    checkNpm(manifest.name, manifest.version, options.npm.range, options.npm.interval, options.restart)
  }

  if (options.git && options.git.enabled) {
    var split = options.git.branch.split('/')
    var remote = 'origin'
    var branch = 'master'

    if (split.length === 1) {
      branch = split[0]
    } else {
      remote = split[0]
      branch = split[1]
    }

    checkGit(remote, branch, options.git.hard, options.git.interval, options.restart)
  }

  if (options.deps && options.deps.enabled) {
    checkDeps(manifest, options.deps.interval, options.restart)
  }
}
