const Crypto = require('crypto')

const csprngBytes = count => Buffer.from(Crypto.randomBytes(count))

module.exports = {
  csprngBytes
}
