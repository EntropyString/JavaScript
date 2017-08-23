import lcm from './lcm'

const _log2  = Math.log2
const _log10 = Math.log10
const _log2_10 = _log2(10)
const _bitsPerByte = 8

const _totalOf = (numStrings, log2Risk) => {
  if (numStrings == 0) { return 0 }

  let N
  if (numStrings < 1000) {
    N = _log2(numStrings) + _log2(numStrings-1)
  }
  else {
    N = 2 * _log2(numStrings)
  }
  return N + log2Risk - 1
}

const bits = (total, risk) => {
  if (total == 0) { return 0 }
  return _totalOf(total, _log2(risk))
}

const bitsWithRiskPower = (total, rPower) => {
  let log2Risk = _log2_10 * rPower
  return _totalOf(total, log2Risk)
}

const bitsWithPowers = (tPower, rPower) => {
  let N = 0
  if (tPower < 4) {
    return bitsWithRiskPower(Math.pow(10, tPower), rPower)
  }
  else {
    return (2 * tPower + rPower) * _log2_10 - 1
  }
}

export default {
  bits,
  bitsWithRiskPower,
  bitsWithPowers
}
