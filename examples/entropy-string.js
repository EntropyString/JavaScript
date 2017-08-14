const Random  = require('../../dist/lib/random').default
const Entropy = require('../../dist/lib/entropy').default
const CharSet = require('../../dist/lib/charSet').default
const {charSet2, charSet4, charSet8, charSet16, charSet32, charSet64} = require('../../dist/lib/charSet')

module.exports = {
  Random,
  Entropy,
  CharSet,
  charSet2,
  charSet4,
  charSet8,
  charSet16,
  charSet32,
  charSet64
}
