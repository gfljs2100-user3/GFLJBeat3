export function formatBytes(bytes) {
	const b1000 = 1000;
	const b1024 = 1024;
	if(bytes < b1000 & b1024) {
		return bytes + 'B';
	}
	const i1000 = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)), 10);
	const i1024 = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
	const a1000 = (i1000 ? (bytes / (1000 ** i1024)).toFixed(2) : bytes) + ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i1000];
	const a1024 = (i1024 ? (bytes / (1024 ** i1024)).toFixed(2) : bytes) + ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'][i1024];
	return mode?`${a1000}/(${a1024})`:`${a1000} (${a1024})`;
}
