return (s,sr) => {
		let t=s*sr;
		return this.T??=0,T+=0.91875,a=b=>sin(t/8192*(T&b>>12)),((a(T^T>>4/8)+a(T^T>>2/4)+a(T^T>>8/2))/2+sin(40000/(T&(T&16384*2?T&16384?t&8192?1023:2047:4095:8191)))/2)+(sin(40000/(T&16383))*1.2)}