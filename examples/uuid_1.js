const { Entropy, charset64 } = require('./entropy-string')

const uuid = '7416179b-62f4-4ea1-9201-6aa4ef920c12'

console.log(`UUID: ${uuid}`)
console.log('  entropy: 122')
console.log('  string len:', uuid.length)
console.log('  string bytes:', uuid.length * 8)
console.log('  efficiency:', 122 / (uuid.length * 8))

const entropy = new Entropy({ bits: 122, charset: charset64 })
const string = entropy.string()
const bits = string.length * 6

console.log()
console.log(`Entropy String: ${string}`)
console.log('  entropy:', bits)
console.log('  string len:', string.length)
console.log('  string bytes:', string.length * 8)
console.log('  efficiency:', bits / (string.length * 8))
