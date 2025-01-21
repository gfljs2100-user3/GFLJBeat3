export function formatBytes2 (bytes, unit) {
	  if (bytes < (unit = unit || 1000)) 
	    return bytes + "B";
		  var exp = parseInt(Math.floor(Math.log(bytes) / Math.log(unit)), 10);
		  var pre = '' + (unit === 1000 ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (unit === 1000 ? "" : "i") + 'B';
	    return (bytes / (Math.pow(unit, exp))).toFixed(2) + pre;
}
