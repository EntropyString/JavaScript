const Random = require('./dist/lib/random').default
const CharSet = require('./dist/lib/charset').default
const {
  charset2, charset4, charset8, charset16, charset32, charset64
} = require('./dist/lib/entropy')

module.exports = {
  Random,
  CharSet,
  charset2,
  charset4,
  charset8,
  charset16,
  charset32,
  charset64
}
