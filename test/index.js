const separio = require('../')

separio({
  git: {
    enabled: true,
    interval: 5000
  },
  
  deps: {
    enabled: true,
    interval: 5000
  },

  npm: {
    range: '^'
  }
})
