// Custom character errors

const { default: Entropy } = require('./entropy')

try {
  const entropy = new Entropy({ charset: '123456' })
  console.error('variable \'entropy\' should not exist', entropy)
} catch (error) {
  console.log(`\n  Error: ${error.message}`)
}

try {
  const entropy = new Entropy({ charset: '01233210' })
  console.error('variable \'entropy\' should not exist', entropy)
} catch (error) {
  console.log(`\n  Error: ${error.message}\n`)
}
