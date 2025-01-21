export function formatBytes (bytes, unit) {
	const unit1024 = unit || 1024
	  if (bytes < (unit = unit || 1000)) 
	    return bytes + "B";
		  var exp = Math.floor(Math.log(bytes) / Math.log(unit));
		  var pre = '' + (unit === 1000 ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (unit === 1000 ? "" : "i") + 'B';
		  var pre1024 = '' + (unit1024 === 1000 ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (unit1024 === 1000 ? "" : "i") + 'B';
	    return `${(bytes / (Math.pow(unit, exp))).toFixed(2) + pre} (${(bytes / (Math.pow(unit1024, exp))).toFixed(2) + pre1024})`;
}
