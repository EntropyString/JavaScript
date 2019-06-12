// Custom bytes
const { Entropy } = require('./entropy-string')

const entropy = new Entropy({ bits: 30 })
const bytes = Buffer.from([250, 200, 150, 100])
let string = entropy.stringWithBytes(bytes)
console.log(`\n  Custom bytes string : ${string}\n`)

try {
  string = entropy.stringWithBytes(bytes, 32)
} catch (error) {
  console.log(`  Error: ${error.message}\n`)
}
