const { default: CharSet } = require('./dist/lib/charset')
const {
  default: Entropy,
  charset2, charset4, charset8, charset16, charset32, charset64
} = require('./dist/lib/entropy')

module.exports = {
  CharSet,
  Entropy,
  charset2,
  charset4,
  charset8,
  charset16,
  charset32,
  charset64
}
