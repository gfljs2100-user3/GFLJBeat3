export function formatBytes (bytes, unit) {
	const unit1000 = unit || 1000
	const unit1024 = unit || 1024
	  if (bytes < (unit1000)) 
	    return bytes + "B";
		  var exp1000 = Math.floor(Math.log(bytes) / Math.log(unit1000));
		  var exp1024 = Math.floor(Math.log(bytes) / Math.log(unit1024));
		  var pre1000 = '' + (bytes === 1000 ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (unit === 1000 ? "" : "i") + 'B';
		  var pre1024 = '' + (bytes === 1024 ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (unit === 1024 ? "" : "i") + 'B';
	    return `${(bytes / (Math.pow(unit, exp1000))).toFixed(2) + pre1000} (${(bytes / (Math.pow(unit, exp1024))).toFixed(2) + pre1024})`;
}
