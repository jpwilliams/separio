const separio = require('../')

separio({
  git: {
    enabled: true,
    interval: '5s'
  },

  deps: {
    enabled: true,
    interval: '10s'
  },

  npm: {
    range: '^'
  }
})
