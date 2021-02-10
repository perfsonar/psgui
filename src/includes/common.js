export function valNumBetweenError(val, min, max) {
  if (val === '' || isNaN(val) || !(val>=min && val<=max)) {
    return true;
  }
  return false;
}

export function getReadableNetworkSpeedString(netSpeedInBits) {
  var i = 0;
  var bitUnits = ['bits/sec', 'kbits/sec', 'Mbits/sec', 'Gbits/sec', 'Tbits/sec'];
  while (netSpeedInBits > 1) {
    //~ console.log(netSpeedInBits);
    netSpeedInBits = netSpeedInBits / 1000;
    //~ console.log(netSpeedInBits);
    i++;
  }

  return bitUnits[i];
};

export function getThousendsDivisionSep(netSpeed) {
  var i = -1;
  var divSep = 1;
  do {
      netSpeed = netSpeed / 1000;
      i++;
      divSep *= 1000;
  } while (netSpeed >= 1000);

  return divSep
}