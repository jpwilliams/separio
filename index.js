// David for checks deps
// NPM for checking package status (current version against latest version)
// Git for checking package status from there? Track a specific branch? All in the URL?
const debug = require('debug')('separio')
const manifest = require(require('path').resolve('package.json'))
const checkNpm = require('./lib/checks/npm')
const checkGit = require('./lib/checks/git')
const checkDeps = require('./lib/checks/deps')
const optionsSchema = require('./lib/optionsSchema')
const joi = require('joi')
const timestring = require('timestring')

module.exports = function separio (options) {
  options = options || {}

  const validation = joi.validate(options, optionsSchema, {
    stripUnknown: true
  })

  if (validation.error) throw validation.error

  options = validation.value

  if (!options.restart) {
    debug('WARNING: No custom restart function provided')

    options.restart = () => {
      debug('Rebooting')
      process.kill(process.pid, process.env.RESTART_SIGNAL || 'SIGUSR2')
    }
  }

  if (options.npm && options.npm.enabled) {
    if (options.npm.range === 'latest') options.npm.range = '*'

    checkNpm(manifest.name, manifest.version, options.npm.range, timestring(options.npm.interval.toString(), 'ms'), options.restart)
  }

  if (options.git && options.git.enabled) {
    const split = options.git.branch.split('/')
    let remote = 'origin'
    let branch = 'master'

    if (split.length === 1) {
      branch = split[0]
    } else {
      remote = split[0]
      branch = split[1]
    }

    checkGit(remote, branch, options.git.hard, timestring(options.git.interval.toString(), 'ms'), options.restart)
  }

  if (options.deps && options.deps.enabled) {
    checkDeps(manifest, timestring(options.deps.interval.toString(), 'ms'), options.restart)
  }
}
