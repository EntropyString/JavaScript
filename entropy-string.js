const Random = require('./dist/lib/random').default
const Entropy = require('./dist/lib/entropy').default
const CharSet = require('./dist/lib/charset').default
const {
  charset2, charset4, charset8, charset16, charset32, charset64
} = require('./dist/lib/charset')

module.exports = {
  Random,
  Entropy,
  CharSet,
  charset2,
  charset4,
  charset8,
  charset16,
  charset32,
  charset64
}
