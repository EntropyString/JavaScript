export const entropyBits = (total, risk) => {
  if (total === 0) { return 0 }

  const { log2 } = Math

  let N
  if (total < 1000) {
    N = log2(total) + log2(total - 1)
  } else {
    N = 2 * log2(total)
  }
  return (N + log2(risk)) - 1
}
