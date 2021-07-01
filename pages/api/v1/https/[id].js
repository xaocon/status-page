// import getConfig from 'next/config'
// const { publicRuntimeConfig } = getConfig()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default async function handler(req, res) {
  let { id } = req.query
  id = parseInt(id)
  await sleep(1000 * id)
  // const val = {pid: true}
  // console.log(req.query)
  // console.log(`from API ${publicRuntimeConfig.https[id].url} ${typeof id}`)
  const worked = Math.random() < 0.5
  console.log(`${id} as ${typeof id}`)
  res.status(200).json({"id": id, "worked": worked})
}
