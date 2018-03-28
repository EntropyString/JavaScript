const CharSet = require('./charset').default

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

export const charset64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
export const charset32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT')
export const charset16 = new CharSet('0123456789abcdef')
export const charset8 = new CharSet('01234567')
export const charset4 = new CharSet('ATCG')
export const charset2 = new CharSet('01')
