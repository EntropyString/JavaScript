const csprngBytes = count => window.crypto.getRandomValues(new Uint8Array(count))

module.exports = {
  csprngBytes
}
