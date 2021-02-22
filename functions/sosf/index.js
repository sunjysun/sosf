const fetch = require('node-fetch')
const { getToken, getFile } = require('./api')

async function handler({ path }) {
  if (path === '/favicon.ico') return null
  const access_token = await getToken()
  if (!access_token) return
  const data = await getFile(path, access_token)
  if (data)
    return {
      statusCode: 302,
      headers: { Location: data['@microsoft.graph.downloadUrl'] },
      body: null,
    }
  else return 'Resource not found'
}

exports.main = handler
