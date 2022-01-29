const { join } = require('path')

const parseStrs = (strs, parmas) =>
  [
    strs.indexOf('drive'),
    strs.indexOf('id'),
    strs.indexOf('path'),
    strs.indexOf('select'),
  ].map((idx) => parmas[idx])

exports.getUploadAPI = (strs, ...params) => {
  const [drive, id, path, select] = parseStrs(strs, params)
  if (id) {
    return `${drive}/items/${id}/createUploadSession`
  } else {
    return `${drive}/root:${join(...path)}:/createUploadSession`
  }
}

exports.getItem = (strs, ...parmas) => {
  const [drive, id, path, select] = parseStrs(strs, parmas)
  if (id) {
    return `${drive}/items/${id}?$select=${select}`
  } else {
    return `${drive}/root:${join(...path)}?$select=${select}`
  }
}

exports.listChildren = (strs, ...parmas) => {
  const [drive, id, path, select] = parseStrs(strs, parmas)
  if (id) {
    return `${drive}/items/${id}/children`
  } else {
    return `${drive}/root:${
      join(...path).replace(/(.)\/$/, '$1')
    }:/children?$select=${select}`
  }
}

exports.listRoot = (strs, ...parmas) => {
  const [drive, _, __, select] = parseStrs(strs, parmas)
  return `${drive}/root/children?$select=${select}`
}
