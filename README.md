# separio

Make your apps self-sufficient.

``` js
require('separio')({
  git: {
    enabled: true,
    branch: 'origin/develop',
    interval: '5m'
  },

  deps: {
    enabled: true,
    interval: '10m'
  },

  npm: {
    enabled: true,
    range: '^',
    interval: '30s'
  }
})
```
