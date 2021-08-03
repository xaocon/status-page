import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

const handler = async (req, res) => {
  console.log("Still using http for init config")

  res.status(200).json(serverRuntimeConfig)
}

export default handler
