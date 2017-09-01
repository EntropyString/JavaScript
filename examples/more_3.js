// Ten billion potential strings with 1 in a trillion risk of repeat

import {Random, Entropy} from './entropy-string'

const random = new Random()
const bits = Entropy.bitsWithPowers(10, 12)
const string = random.string(bits)

console.log('\n  Ten billion potential strings with 1 in a trillion risk of repeat: ' + string + '\n')
