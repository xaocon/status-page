type Config = {id: Number, type: String, url: String}

import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()
const lineList: Config[] = serverRuntimeConfig.list

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const handler = async (req, res) => {
  let { id } = req.query
  id = parseInt(id)

  if (! lineList.some(x => x.id === id)) {
    res.status(404).send()
    return
  }

  await sleep(1000 * id)

  const worked = Math.random() < 0.5
  res.status(200).json({"id": id, "worked": worked})
}

export default handler
