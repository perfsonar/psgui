export function valNumBetweenError(val, min, max) {
  if (val === '' || isNaN(val) || !(val>=min && val<=max)) {
    return true;
  }
  return false;
}
