export function formatBytes (bytes, unit) {
  if (bytes < (unit = unit || 1000)) 
    return bytes + "B";
  var exp = Math.floor(Math.log(bytes) / Math.log(unit));
  var pre = '' + (unit === 10000 ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (unit === 10000 ? "" : "i") + 'B';
    return (bytes / (Math.pow(unit, exp))).toFixed(2) + pre;
}
