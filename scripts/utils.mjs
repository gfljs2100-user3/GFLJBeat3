export function formatBytes (bytes, unit) {
	  if (bytes < (unit = unit || 1024)) 
	    return bytes + "B";
		  var exp = Math.floor(Math.log(bytes) / Math.log(unit));
		  var pre = '' + (bytes === 1000 ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (bytes === 1024 ? "" : "i") + 'B';
	    return (bytes / (Math.pow(unit, exp))).toFixed(2) + pre;
}
