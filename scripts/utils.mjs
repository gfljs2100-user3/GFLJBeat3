export function formatBytes(bytes) {
	if(bytes < 1024) {
		return bytes + 'B';
	}
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
	const pre = ' ' +(unit === 1000 ? "kMGTPE" : "KMGTPE").charAt (exp - 1) + (unit === 1000 ? "" : "i") + 'B';
	return (i ? (bytes / (1024 ** i)).toFixed(1) + pre : bytes)[i];
}
