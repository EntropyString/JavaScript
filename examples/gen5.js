const { default: Entropy, charset16 } = require('./entropy')

const entropy = new Entropy({ total: 10000,
                              risk: 1000000,
                              charset: charset16 })

const strings = Array(5).fill('').map(e => entropy.string())
console.log(`\n  5 IDs: ${strings.join(', ')}\n`)
