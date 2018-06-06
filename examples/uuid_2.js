const { Entropy } = require('./entropy-string')

const total = 1e6
console.log('For 1 million IDs, the entropy bits for a risk of repeat of:')
console.log(' 1 in a million ', Entropy.bits(total, 1e6))
console.log(' 1 in a billion ', Entropy.bits(total, 1e9))
console.log(' 1 in a trillion', Entropy.bits(total, 1e12))
