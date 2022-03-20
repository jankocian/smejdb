/**
 *
 * utils
 *
 */
exports.dateString = function(ts = new Date()) {
  const year = ts.getUTCFullYear()
  const month = (ts.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = ts
    .getUTCDate()
    .toString()
    .toString()
    .padStart(2, '0')
  const name = `${year}-${month}-${day}`
  return name
}

exports.urlRegex = /(?<=^|[\s,;-])([\w][\w-]+\.[a-z]{2,}\S*)\b/