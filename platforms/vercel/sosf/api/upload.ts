import { getToken, getUploadAPI } from '@beetcb/sor'

export default async function handler({
    _,
    queryStringParameters,
    headers,
  }) {
    const { id, key, type, path = '/' } = queryStringParameters
    const { access_key } = process.env
  
    const isReqFolder = path.endsWith('/') && type !== 'file'
  
    if (path === '/favicon.ico' || (isReqFolder && access_key != key)) {
      return {
        statusCode: 404
      }
    }
  
    const access_token = await getToken()
  
    if (!access_token) {
      return {
        statusCode: 404
      }
    }
  
    if (isReqFolder && type !== 'file') {
      
    } else {
      // Render file
      const data = await getUploadAPI(path, access_token, id)
      if (data) {
        return {
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(Object.assign({a_t: access_token}, data)),
        }
      } else return {
        statusCode: 404
      }
    }
  }
  