export class UI {
  constructor() {
		this.audioCtx = null;
		this.audioGain = null;
		this.audioRecordChunks = [];
		this.audioRecorder = null;
		this.audioWorkletNode = null;
		this.byteSample = 0;
		this.cacheParentElem = null;
		this.cacheTextElem = null;
		this.canvasContainer = null;
		this.canvasCtx = null;
		this.canvasElem = null;
		this.canvasHeight = 256;
		this.canvasPlayButton = null;
		this.canvasTimeCursor = null;
		this.canvasWidth = 1024;
		this.containerFixedElem = null;
		this.controlCodeStyle = null;
		this.controlColorDiagram = null;
		this.controlColorDiagramInfo = null;
		this.controlColorStereo = 1; // Left=G, Right=R+B
		this.controlColorWaveform = null;
		this.controlColorWaveformInfo = null;
		this.controlDrawMode = null;
		this.controlPlaybackMode = null;
		this.controlRecord = null;
		this.controlSampleRate = null;
		this.controlSampleRateSelect = null;
		this.controlScale = null;
		this.controlScaleDown = null;
		this.controlThemeStyle = null;
		this.controlTime = null;
		this.controlTimeUnits = null;
		this.controlVolume = null;
		this.colorChannels = null;
		this.colorDiagram = null;
		this.colorWaveform = null;
		this.defaultSettings = {
			codeStyle: 'GFLJS2100',
			colorDiagram: '#ffa200',
			colorStereo: 1,
			colorTimeCursor: '#fbff00',
			colorWaveform: '#ffffff',
			drawMode: 'Combined',
			drawScale: 5,
			isSeconds: false,
			themeStyle: 'Default',
			volume: .5,
			audioSampleRate: 48000
		};
		this.drawBuffer = [];
		this.drawEndBuffer = [];
		this.editorElem = null;
		this.errorElem = null;
		this.isCompilationError = false;
		this.isNeedClear = false;
		this.isPlaying = false;
		this.isRecording = false;
		this.playbackSpeed = 1;
		ui.settingsAudioRate.value = this.settings.audioSampleRate;
		this.settings = this.defaultSettings;
		this.songData = { mode: 'Bytebeat', sampleRate: 8000 };
		this.init();
	}
	copyLink() {
		navigator.clipboard.writeText(window.location);
	}
	expandEditor() {
		this.containerFixedElem.classList.toggle('container-expanded');
	}
	initElements() {
		// Containers
		this.cacheParentElem = document.createElement('div');
		this.cacheTextElem = document.createTextNode('');
		this.cacheParentElem.appendChild(this.cacheTextElem);
		this.containerFixedElem = document.getElementById('container-fixed');
		['change', 'click', 'input', 'keydown'].forEach(
			e => this.containerFixedElem.addEventListener(e, this));
		const containerScroll = document.getElementById('container-scroll');
		['change', 'click', 'mouseover'].forEach(e => containerScroll.addEventListener(e, this));

		// Volume
		this.controlVolume = document.getElementById('control-volume');
		this.setVolume(true);

		// Canvas
		this.canvasContainer = document.getElementById('canvas-container');
		this.canvasElem = document.getElementById('canvas-main');
		this.canvasCtx = this.canvasElem.getContext('2d');
		this.canvasPlayButton = document.getElementById('canvas-play');
		this.canvasTimeCursor = document.getElementById('canvas-timecursor');
		this.onresizeWindow();
		document.defaultView.addEventListener('resize', () => this.onresizeWindow());

		// Time counter
		this.controlTime = document.getElementById('control-counter');
		this.controlTimeUnits = document.getElementById('control-counter-units');
		this.setCounterUnits();

		// Editor
		this.editorContainer = document.getElementById('editor-container');
		this.setCodeStyle();
		this.editorElem = document.getElementById('editor-default');
		this.errorElem = document.getElementById('error');

		// Controls
		this.controlCodeSize = document.getElementById('control-codesize');
		this.controlColorStereo = document.getElementById('control-color-stereo');
		this.setColorStereo();
		this.controlColorDiagram = document.getElementById('control-color-diagram');
		this.controlColorDiagramInfo = document.getElementById('control-color-diagram-info');
		this.setColorDiagram();
		this.controlColorWaveform = document.getElementById('control-color-waveform');
		this.controlColorWaveformInfo = document.getElementById('control-color-waveform-info');
		this.setColorWaveform();
		this.controlColorTimeCursor = document.getElementById('control-color-timecursor');
		this.setColorTimeCursor();
		this.controlDrawMode = document.getElementById('control-drawmode');
		this.controlDrawMode.value = this.settings.drawMode;
		this.sendData({ drawMode: this.settings.drawMode });
		this.controlPlaybackMode = document.getElementById('control-mode');
		this.controlPlayBackward = document.getElementById('control-play-backward');
		this.controlPlayForward = document.getElementById('control-play-forward');
		this.controlRecord = document.getElementById('control-rec');
		this.controlSampleRate = document.getElementById('control-samplerate');
		this.controlSampleRateSelect = document.getElementById('control-samplerate-select');
		this.controlScale = document.getElementById('control-scale');
		this.controlScaleDown = document.getElementById('control-scaledown');
		this.setScale(0);
		this.controlThemeStyle = document.getElementById('control-theme-style');
		this.controlThemeStyle.value = this.settings.themeStyle;
		this.controlCodeStyle = document.getElementById('control-code-style');
		this.controlCodeStyle.value = this.settings.codeStyle;
		this.settingsAudioRate = document.getElementById('settings-audiorate');
		this.settingsAudioRateApplyButton = document.getElementById('settings-audiorate-apply');
	}
	setCodeSize(value) {
		this.controlCodeSize.textContent = `${this.formatBytes(new Blob([value]).size)} (${this.formatBytes(String(window.location).length)})`;
	}
	setPlayButton(buttonElem, speed) {
		const isFast = speed !== 1;
		buttonElem.classList.toggle('control-fast', isFast);
		buttonElem.classList.toggle('control-play', !isFast);
		if(speed) {
			buttonElem.firstElementChild.textContent = speed;
			buttonElem.removeAttribute('disabled');
		} else {
			buttonElem.setAttribute('disabled', true);
			buttonElem.removeAttribute('title');
			return;
		}
		const direction = buttonElem === this.controlPlayForward ? 'forward' : 'reverse';
		buttonElem.title = `Play ${ isFast ? `fast ${ direction } x${ speed } speed` : direction }`;
	}
}
