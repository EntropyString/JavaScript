const { log2 } = Math
const LOG2_OF_10 = log2(10)

const totalOf = (numStrings, log2Risk) => {
  if (numStrings === 0) { return 0 }

  let N
  if (numStrings < 1000) {
    N = log2(numStrings) + log2(numStrings - 1)
  } else {
    N = 2 * log2(numStrings)
  }
  return (N + log2Risk) - 1
}

const bits = (total, risk) => {
  if (total === 0) { return 0 }
  return totalOf(total, log2(risk))
}

// CxTBD Mark as obsolete
const bitsWithRiskPower = (total, rPower) => {
  const log2Risk = LOG2_OF_10 * rPower
  return totalOf(total, log2Risk)
}

// CxTBD Mark as obsolete
const bitsWithPowers = (tPower, rPower) => {
  let nBits
  if (tPower < 4) {
    nBits = bitsWithRiskPower(10 ** tPower, rPower)
  } else {
    nBits = ((((2 * tPower) + rPower) * LOG2_OF_10) - 1)
  }
  return nBits
}

export default {
  bits,
  bitsWithRiskPower,
  bitsWithPowers
}
