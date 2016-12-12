const joi = require('joi')

module.exports = joi.object().keys({
  npm: joi.object().keys({
    enabled: joi.boolean().default(true),
    range: joi.string().valid(['^', '~', 'latest', '*']),
    interval: joi.number().integer().default(30000)
  }),

  git: joi.object().keys({
    enabled: joi.boolean().default(true),
    branch: joi.string().default('origin/master'),
    interval: joi.number().integer().default(30000),
    hard: joi.boolean().default(false)
  }).rename('uri', 'url', {ignoreUndefined: true}),

  deps: joi.object().keys({
    enabled: joi.boolean().default(true),
    interval: joi.number().integer().default(30000)
  }),

  restart: joi.func()
})
