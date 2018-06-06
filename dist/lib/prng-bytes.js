"use strict";

var ceil = Math.ceil,
    random = Math.random;


var BITS_PER_BYTE = 8;

var endianByteNum = function () {
  var buf32 = new Uint32Array(1);
  var buf8 = new Uint8Array(buf32.buffer);
  buf32[0] = 0xff;
  return buf8[0] === 0xff ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7];
}();

var prngBytes = function prngBytes(count) {
  var BYTES_USED_PER_RANDOM_CALL = 6;
  var randCount = ceil(count / BYTES_USED_PER_RANDOM_CALL);

  var buffer = new ArrayBuffer(count);
  var dataView = new DataView(new ArrayBuffer(BITS_PER_BYTE));
  for (var rNum = 0; rNum < randCount; rNum += 1) {
    dataView.setFloat64(0, random());
    for (var n = 0; n < BYTES_USED_PER_RANDOM_CALL; n += 1) {
      var fByteNum = endianByteNum[n];
      var bByteNum = rNum * BYTES_USED_PER_RANDOM_CALL + n;
      if (bByteNum < count) {
        buffer[bByteNum] = dataView.getUint8(fByteNum);
      }
    }
  }
  return buffer;
};

module.exports = {
  prngBytes: prngBytes
};