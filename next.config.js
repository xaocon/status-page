require('json5/lib/register')

const config = require('./status-config.json5')

// This is a little ugly but fine
let newConfig = []
let idx = 0
for (const [key, values] of Object.entries(config)) {
  for (const value of values) {
    newConfig.push({
      "id": idx += 1,
      "type": key,
      "url": value,
    })
  }
}

module.exports = {
  serverRuntimeConfig: {"list": newConfig},
}
