const joi = require('joi')

module.exports = joi.object().keys({
  npm: joi.object().keys({
    enabled: joi.boolean().default(true),
    range: joi.string().valid(['^', '~', 'latest', '*']),
    interval: joi.string().default('30s')
  }),

  git: joi.object().keys({
    enabled: joi.boolean().default(true),
    branch: joi.string().default('origin/master'),
    interval: joi.string().default('30s'),
    hard: joi.boolean().default(false)
  }).rename('uri', 'url', {ignoreUndefined: true}),

  deps: joi.object().keys({
    enabled: joi.boolean().default(true),
    interval: joi.string().default('30s')
  }),

  restart: joi.func()
})
