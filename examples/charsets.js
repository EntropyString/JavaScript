// Predefined character sets
const {
  charset64, charset32, charset16, charset8, charset4, charset2
} = require('./entropy-string')

console.log(`\n  charset64: ${charset64.chars}`)
console.log(`\n  charset32: ${charset32.chars}`)
console.log(`\n  charset16: ${charset16.chars}`)
console.log(`\n  charset8:  ${charset8.chars}`)
console.log(`\n  charset4:  ${charset4.chars}`)
console.log(`\n  charset2:  ${charset2.chars}\n`)
