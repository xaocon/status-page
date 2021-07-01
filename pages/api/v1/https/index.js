const config = require('../../../../status-config.json')


export default async function handler(req, res) {
  console.log("in api http")
  let newConfig = {"types": [], "list": [], "size": 0}
  let idx = -1
  for (const [key, values] of Object.entries(config)) {
    newConfig["types"].push(key)
    newConfig["list"] = newConfig["list"].concat(values.map(v => ({
      "id": idx += 1,
      "type": key,
      "url": v,
      "worked": null,
    })))
  }
  newConfig["size"] = Math.max(...newConfig.list.map(l => l.id))

  res.status(200).json(newConfig)
}
