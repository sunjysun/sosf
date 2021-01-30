const fetch = require('node-fetch')
const timestamp = () => (Date.now() / 1000) | 0
const headers = {
  'content-type': 'application/x-www-form-urlencoded',
}

async function acquireToken() {
  const {
    client_id,
    client_secret,
    refresh_token,
    redirect_uri,
    auth_endpoint,
  } = process.env

  try {
    const res = await fetch(`${auth_endpoint}/token`, {
      method: 'POST',
      body: `${new URLSearchParams({
        grant_type: 'refresh_token',
        client_id,
        client_secret,
        refresh_token,
      }).toString()}&redirect_uri=${redirect_uri}`,
      headers,
    })
    return await storeToken(res)
  } catch (e) {
    console.warn(e)
  }
}

async function storeToken(res) {
  const { expires_in, access_token, refresh_token } = await res.json()
  const expires_at = timestamp() + expires_in
  const token = { expires_at, access_token, refresh_token }
  return (process.env.token = JSON.stringify(token))
}

function checkExpired(token) {
  token = JSON.parse(token)
  const { expires_at } = token
  if (timestamp() > expires_at) {
    console.warn('Updated stored token')
    return true
  } else {
    console.warn('Using stored token')
  }
}

async function getToken() {
  let token = process.env.token
  if (!token || checkExpired(token)) token = await acquireToken()
  token = JSON.parse(token)
  return token.access_token
}

async function handler() {
  const access_token = await getToken()
  console.log(access_token)
}

exports.main = handler