import { inflateRaw, deflateRaw } from './pako.esm.min.mjs';

export function parseUrl() {
		let { hash } = window.location;
		if(!hash) {
			this.updateUrl();
			({ hash } = window.location);
		}
		let songData;
		if (hash.startsWith('#v3b64') || hash.startsWith('#GFLJBeat3-')) {
			try {
				const hashString = hash.startsWith('#GFLJBeat3-') ? atob(hash.slice(11)) : atob(hash.slice(6));
				const dataBuffer = new Uint8Array(hashString.length);
				for (const i in hashString) {
					if (Object.prototype.hasOwnProperty.call(hashString, i)) {
						dataBuffer[i] = hashString.charCodeAt(i);
					}
				}
				songData = inflateRaw(dataBuffer, { to: 'string' });
				if (!songData.startsWith('{')) { // XXX: old format
					songData = { code: songData, sampleRate: 8000, mode: 'Bytebeat' };
				} else {
					songData = JSON.parse(songData);
					if (songData.formula) { // XXX: old format
						songData.code = songData.formula;
					}
				}
			} catch (err) {
				console.error(`Couldn't load data from url: ${err}`);
			}
		} else {
			console.error('Couldn\'t load data from url: unrecognized url data');
		}
		this.loadCode(songData || { code: this.editorValue }, false);
	}
