// Custom bytes

const { default: Entropy } = require('./entropy')

const entropy = new Entropy()
const bytes = Buffer.from([250, 200, 150, 100])
let string = entropy.stringWithBytes(30, bytes)
console.log(`\n  Custom bytes string : ${string}\n`)

try {
  string = entropy.stringWithBytes(32, bytes)
} catch (error) {
  console.log(`  Error: ${error.message}\n`)
}

