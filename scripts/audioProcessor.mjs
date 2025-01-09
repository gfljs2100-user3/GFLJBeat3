class audioProcessor extends AudioWorkletProcessor {
	constructor(...args) {
		super(...args);
		this.audioSample = 0;
		this.byteSample = 0;
		this.drawMode = 'Points';
		this.errorDisplayed = true;
		this.func = null;
		this.getValues = null;
		this.isFuncbeat = false;
		this.isRAW = false;
		this.isWavePot = false;
		this.isFuncBytebeat = false;
		this.isSignedFuncBytebeat = false;
		this.isPlaying = false;
		this.playbackSpeed = 1;
		this.lastByteValue = [null, null];
		this.lastFuncValue = [null, null];
		this.lastTime = -1;
		this.outValue = [0, 0, 0, 0];
		this.sampleRate = 8000;
		this.sampleRatio = 1;
		Object.seal(this);
		audioProcessor.deleteGlobals();
		audioProcessor.freezeGlobals();
		this.port.addEventListener('message', e => this.receiveData(e.data));
		this.port.start();
	}
	static deleteGlobals() {
		// Delete single letter variables to prevent persistent variable errors (covers a good enough range)
		for(let i = 0; i < 26; ++i) {
			delete globalThis[String.fromCharCode(65 + i)];
			delete globalThis[String.fromCharCode(97 + i)];
		}
		// Delete global variables
		for(const name in globalThis) {
			if(Object.prototype.hasOwnProperty.call(globalThis, name)) {
				delete globalThis[name];
			}
		}
	}
	static freezeGlobals() {
		Object.getOwnPropertyNames(globalThis).forEach(name => {
			const prop = globalThis[name];
			const type = typeof prop;
			if((type === 'object' || type === 'function') && name !== 'globalThis') {
				Object.freeze(prop);
			}
			if(type === 'function' && Object.prototype.hasOwnProperty.call(prop, 'prototype')) {
				Object.freeze(prop.prototype);
			}
			Object.defineProperty(globalThis, name, { writable: false, configurable: false });
		});
	}
	static getErrorMessage(err, time) {
		const when = time === null ? 'compilation' : 't=' + time;
		if(!(err instanceof Error)) {
			return `${ when } thrown: ${ typeof err === 'string' ? err : JSON.stringify(err) }`;
		}
		const { message, lineNumber, columnNumber } = err;
		return `${ when } error: ${ typeof message === 'string' ? message : JSON.stringify(message) }${
			typeof lineNumber === 'number' && typeof columnNumber === 'number' ?
				` (at line ${ lineNumber - 3 }, character ${ +columnNumber })` : '' }`;
	}
	process(inputs, [chData]) {
		const chDataLen = chData[0].length;
		if(!chDataLen || !this.isPlaying) {
			return true;
		}
		let time = this.sampleRatio * this.audioSample;
		let { byteSample } = this;
		const drawBuffer = [];
		const isDiagram = this.drawMode === 'Combined' || this.drawMode === 'Diagram';
		for(let i = 0; i < chDataLen; ++i) {
			time += this.sampleRatio;
			const currentTime = Math.floor(time);
			if(this.lastTime !== currentTime) {
				let funcValue;
				const currentSample = Math.floor(byteSample);
				try {
					if(this.isFuncbeat) {
						funcValue = this.func(currentSample / this.sampleRate, this.sampleRate);
					} else if(this.isWavePot) {
						funcValue = this.func(currentSample / 44100, 44100);
					} else if(this.isFuncBytebeat) {
						funcValue = this.func(currentSample / this.sampleRate, this.sampleRate);
					} else if(this.isSignedFuncBytebeat) {
						funcValue = this.func(currentSample / this.sampleRate, this.sampleRate);
					} else if(this.isRAW) {
						funcValue = this.func(currentSample);
					} else {
						funcValue = this.func(currentSample);
					}
				} catch(err) {
					if(this.errorDisplayed) {
						this.errorDisplayed = false;
						this.sendData({
							error: {
								message: audioProcessor.getErrorMessage(err, currentSample),
								isRuntime: true
							}
						});
					}
					funcValue = NaN;
				}
				funcValue = Array.isArray(funcValue) ? [funcValue[0], funcValue[1]] : [funcValue, funcValue];
				let hasValue = false;
				let ch = 2;
				while(ch--) {
					try {
						funcValue[ch] = +funcValue[ch];
					} catch(err) {
						funcValue[ch] = NaN;
					}
					if(isDiagram) {
						if(!isNaN(funcValue[ch])) {
							this.outValue[ch] = this.getValues(funcValue[ch], ch);
						} else {
							this.lastByteValue[ch] = NaN;
						}
						hasValue = true;
						continue;
					}
					if(funcValue[ch] === this.lastFuncValue[ch]) {
						continue;
					} else if(!isNaN(funcValue[ch])) {
						this.outValue[ch] = this.getValues(funcValue[ch], ch);
						hasValue = true;
					} else if(!isNaN(this.lastFuncValue[ch])) {
						this.lastByteValue[ch] = NaN;
						hasValue = true;
					}
				}
				if(hasValue) {
					drawBuffer.push({ t: currentSample, value: [...this.lastByteValue] });
				}
				byteSample += currentTime - this.lastTime;
				this.lastFuncValue = funcValue;
				this.lastTime = currentTime;
			}
			chData[0][i] = this.outValue[0];
			chData[1][i] = this.outValue[1];
		}
		if(Math.abs(byteSample) > Number.MAX_SAFE_INTEGER) {
			this.resetTime();
			return true;
		}
		this.audioSample += chDataLen;
		let isSend = false;
		const data = {};
		if(byteSample !== this.byteSample) {
			isSend = true;
			data.byteSample = this.byteSample = byteSample;
		}
		if(drawBuffer.length) {
			isSend = true;
			data.drawBuffer = drawBuffer;
		}
		if(isSend) {
			this.sendData(data);
		}
		return true;
	}
	receiveData(data) {
		if(data.byteSample !== undefined) {
			this.byteSample = +data.byteSample || 0;
			this.resetValues();
		}
		if(data.errorDisplayed === true) {
			this.errorDisplayed = true;
		}
		if(data.isPlaying !== undefined) {
			this.isPlaying = data.isPlaying;
		}
		if(data.playbackSpeed !== undefined) {
			const sampleRatio = this.sampleRatio / this.playbackSpeed;
			this.playbackSpeed = data.playbackSpeed;
			this.setSampleRatio(sampleRatio);
		}
		if(data.mode !== undefined) {
			this.isFuncbeat = data.mode === 'Funcbeat';
			this.isFuncBytebeat = data.mode === 'FuncBytebeat';
			this.isSignedFuncBytebeat = data.mode === 'Signed FuncBytebeat';
			this.isWavePot = data.mode === 'WavePot';
			this.isRAW = data.mode === 'RAW';
			switch(data.mode) {
			case 'Bytebeat':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = funcValue & 255) / 127.5 - 1;
				break;
			case 'FuncBytebeat':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = funcValue & 255) / 127.5 - 1;
				break;
			case 'Signed Bytebeat':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = funcValue + 128 & 255) / 127.5 - 1;
				break;
			case 'Signed FuncBytebeat':
				this.getValues = (funcValue, ch) =>
					(this.lastByteValue[ch] = (funcValue + 128) & 255) / 127.5 - 1;
				break;
			case 'Floatbeat':
			case 'Funcbeat':
				this.getValues = (funcValue, ch) => {
					const outValue = Math.max(Math.min(funcValue, 1), -1);
					this.lastByteValue[ch] = Math.round((outValue + 1) * 127.5);
					return outValue;
				};
				break;
		        case 'WavePot':
		            this.getValues = (funcValue, ch) => {
			                const outValue = Math.max(Math.min(funcValue, 1), -1);
			                this.lastByteValue[ch] = Math.round((outValue + 1) * 127.5);
			                return outValue;
		                };
		                this.sampleRate = 44100;
		                break;
			case 'Logmode':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = (Math.log2(funcValue) * 32) & 255) / 127.5 - 1;
				break;
			case 'Bitbeat':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = (funcValue & 1) * 127 + 64) / 127.5 - 1;
				break;
			case '2048':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = Math.floor(funcValue / 8 & 255)) / 127.5 - 1;
				break;
			case 'LogHack':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = (Math.log2(Math.abs(funcValue)) * (((funcValue) < 0) ? -32 : 32)) & 255) / 127.5 - 1;
				break;
			case 'LogHack2':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = funcValue == 0 ? 128 : (((Math.log2(Math.abs(funcValue)) * (funcValue < 0 ? -16 : 16)) + (funcValue < 0 ? -127 : 128)) & 255)) / 127.5 - 1;
				break;
			case 'Cbrtmode':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = (Math.cbrt(funcValue)) & 255) / 127.5 - 1;
				break;
			case 'Log10mode':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = (Math.log10(funcValue) * 32) & 255) / 127.5 - 1;
				break;
			case 'Sinmode':
				this.getValues = (funcValue, ch) => {
					const outValue = Math.max(Math.min(Math.sin(funcValue), 1), -1);
					this.lastByteValue[ch] = Math.round((outValue + 1) * 127.5);
					return outValue;
				};
				break;
			case 'Sinfmode':
				this.getValues = (funcValue, ch) => {
					const outValue = Math.max(Math.min(Math.sin((funcValue) * Math.PI / 128), 1), -1);
					this.lastByteValue[ch] = Math.round((outValue + 1) * 127.5);
					return outValue;
				};
				break;
			case 'nowthisisnotmatters':
				this.getValues = (funcValue, ch) => {
					const outValue = Math.max(Math.min((funcValue) / 128 - 1, 1), -1);
					this.lastByteValue[ch] = Math.round((outValue + 1) * 127.5);
					return outValue;
				};
				break;
			case 'AnewModeasFloatBeat':
				this.getValues = (funcValue, ch) => {
					const outValue = Math.min(Math.max(Math.min(Math.max(funcValue, -255), 255), -1), 1)
					this.lastByteValue[ch] = Math.round((outValue + 1) * 127.5);
					return outValue;
				};
				break;
			case 'Doublebeat':
				this.getValues = (funcValue, ch) => {
					const outValue = Math.min(Math.max((((Math.min(Math.max(funcValue, -255), 255) * 127.5 + 127) & 255) / 128 - 1), -1), 1)
					this.lastByteValue[ch] = Math.round((outValue + 1) * 127.5);
					return outValue;
				};
				break;
			case 'Triangle Bytebeat':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = ((funcValue << 1) ^ - (funcValue >> 7 & 1)) & 255) / 127.5 - 1;
				break;
			case 'Triangle Bytebeat 2':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = ((Math.asin(Math.sin((funcValue) * Math.PI / 128)) / 1.57) * 127 + 127) & 255) / 127.5 - 1;
				break;
			case 'Cbrtsinmode':
				this.getValues = (funcValue, ch) => {
					const outValue = Math.max(Math.min(Math.cbrt(Math.sin((funcValue))), 1), -1);
					this.lastByteValue[ch] = Math.round((outValue + 1) * 127.5);
					return outValue;
				};
				break;
			case 'Cbrtsinfmode':
				this.getValues = (funcValue, ch) => {
					const outValue = Math.max(Math.min(Math.cbrt(Math.sin((funcValue) * Math.PI / 128)), 1), -1);
					this.lastByteValue[ch] = Math.round((outValue + 1) * 127.5);
					return outValue;
				};
				break;
			case 'RAW':
				this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = funcValue & 255) / 127.5 - 1;
				break;
			default: this.getValues = (funcValue, ch) => (this.lastByteValue[ch] = NaN);
			}
		}
		if(data.drawMode !== undefined) {
			this.drawMode = data.drawMode;
		}
		if(data.setFunction !== undefined) {
			this.setFunction(data.setFunction);
		}
		if(data.resetTime === true) {
			this.resetTime();
		}
		if(data.sampleRate !== undefined) {
			this.sampleRate = data.sampleRate;
		}
		if(data.sampleRatio !== undefined) {
			this.setSampleRatio(data.sampleRatio);
		}
	}
	sendData(data) {
		this.port.postMessage(data);
	}
	resetTime() {
		this.byteSample = 0;
		this.resetValues();
		this.sendData({ byteSample: 0 });
	}
	resetValues() {
		this.audioSample = 0;
		this.lastByteValue = this.lastFuncValue = [null, null];
		this.lastTime = -1;
		this.outValue = [0, 0];
	}
	setFunction(codeText) {
		// Create shortened Math functions
		const params = Object.getOwnPropertyNames(Math);
		const values = params.map(k => Math[k]);
		params.push('int', 'window');
		values.push(Math.floor, globalThis);
		audioProcessor.deleteGlobals();
		// Bytebeat code testing
		let isCompiled = false;
		const oldFunc = this.func;
		try {
			if(this.isFuncbeat) {
				this.func = new Function(...params, codeText).bind(globalThis, ...values);
			} else if(this.isWavePot) {
				this.func = new Function(...params, `var sampleRate = ${this.sampleRate}; ${codeText} return dsp;`).bind(globalThis, ...values);
			} else if(this.isFuncBytebeat) {
				this.func = new Function(...params, codeText).bind(globalThis, ...values);
			} else if(this.isSignedFuncBytebeat) {
				this.func = new Function(...params, codeText).bind(globalThis, ...values);
			} else if(this.isRAW) {
				this.func = new Function(...params, `return function(t) {${codeText}}`).bind(globalThis, ...values);
			} else {
				// Optimize code like eval(unescape(escape`XXXX`.replace(/u(..)/g,"$1%")))
				codeText = codeText.trim().replace(
					/^eval\(unescape\(escape(?:`|\('|\("|\(`)(.*?)(?:`|'\)|"\)|`\)).replace\(\/u\(\.\.\)\/g,["'`]\$1%["'`]\)\)\)$/,
					(match, m1) => unescape(escape(m1).replace(/u(..)/g, '$1%')));
				this.func = new Function(...params, 't', `return 0,\n${ codeText || 0 };`)
					.bind(globalThis, ...values);
			}
			isCompiled = true;
			if(this.isFuncbeat) {
				this.func = this.func();
				this.func(0, this.sampleRate);
			} else if(this.isWavePot) {
				this.func = this.func();
				this.func(0, 44100);
			} else if(this.isFuncBytebeat) {
				this.func = this.func();
				this.func(0, this.sampleRate);
			} else if(this.isSignedFuncBytebeat) {
				this.func = this.func();
				this.func(0, this.sampleRate);
			} else if(this.isRAW) {
				this.func = this.func();
				this.func(0);
			} else {
				this.func(0);
			}
		} catch(err) {
			if(!isCompiled) {
				this.func = oldFunc;
			}
			this.errorDisplayed = false;
			this.sendData({
				error: {
					message: audioProcessor.getErrorMessage(err, isCompiled ? 0 : null),
					isCompiled
				},
				updateUrl: isCompiled
			});
			return;
		}
		this.errorDisplayed = false;
		this.sendData({ error: { message: '', isCompiled }, updateUrl: true });
	}
	setSampleRatio(sampleRatio) {
		const timeOffset = Math.floor(this.sampleRatio * this.audioSample) - this.lastTime;
		this.sampleRatio = sampleRatio * this.playbackSpeed;
		this.lastTime = Math.floor(this.sampleRatio * this.audioSample) - timeOffset;
	}
}

registerProcessor('audioProcessor', audioProcessor);
