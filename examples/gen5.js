const { Entropy, charset16 } = require('./entropy-string')

const entropy = new Entropy({ total: 10000, risk: 1000000, charset: charset16 })

const strings = Array(5).fill('').map(_ => entropy.string())
console.log(`\n  5 IDs: ${strings.join(', ')}\n`)
