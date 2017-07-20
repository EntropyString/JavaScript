const _gcd = (a, b) => {
  while (b != 0) {
    [a, b] = [b, a % b]
  }
  return Math.abs(a)
}

export default (a, b) => {
  return (a / _gcd(a, b)) * b
}
