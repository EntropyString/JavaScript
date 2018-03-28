// Custom character errors

const { Random } = require('./entropy-string')

try {
  const random = new Random('123456')
  console.error('variable \'random\' should not exist', random)
} catch (error) {
  console.log(`\n  Error: ${error.message}`)
}

try {
  const random = new Random('01233210')
  console.error('variable \'random\' should not exist', random)
} catch (error) {
  console.log(`\n  Error: ${error.message}\n`)
}
