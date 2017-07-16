
const gcd = (a, b) => {
  while (b != 0) {
    const h = a
    a = b
    b = h % b
    // (a, b) = (b, a % b)
  }
  return Math.abs(a)
}

// const lcm = (a, b) => {
//   return (a / gcd(a, b)) * b
// }

export default (a, b) => {
  return (a / gcd(a, b)) * b
}
