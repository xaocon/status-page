type Config = {id: Number, type: String, url: String}

const PORT = 2320
const HOST = "127.0.0.1"
import getConfig from 'next/config'
// @ts-ignore
const net = require('net')
const { serverRuntimeConfig } = getConfig()
const lineList: Config[] = serverRuntimeConfig.list

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

const handler = async (req, res) => {
  let { id } = req.query
  id = parseInt(id)

  if (! lineList.some(x => x.id === id)) {
    res.status(404).send()
    return
  }

  let client = net.createConnection({host: HOST, port: PORT + id})
  client.on("connect", () => {
    res.status(200).json({"id": id, "worked": true})
    client.end()
  })
  client.on("timeout", () => {
    res.status(200).json({"id": id, "worked": false})
  })
  client.on("error", () => {
    res.status(200).json({"id": id, "worked": false})
  })
  // client.on("close", (hadError) => {
  //   res.status(200).json({"id": id, "worked": false})
  // })
}

export default handler
