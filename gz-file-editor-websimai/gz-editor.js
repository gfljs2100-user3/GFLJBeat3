import { inflate as decompress, deflate as compress } from 'https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm';

class GZFileEditor {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.noFileControls = document.getElementById('noFileControls');
        this.fileControls = document.getElementById('fileControls');
        this.fileContent = document.getElementById('fileContent');
        this.fetchInitialBtn = document.getElementById('fetchInitialBtn');
        this.fetchBtn = document.getElementById('fetchBtn');
        this.decompressBtn = document.getElementById('decompressBtn');
        this.compressBtn = document.getElementById('compressBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.updateBtn = document.getElementById('updateBtn');

        this.currentFile = null;
        this.currentFileData = null;

        this.initEventListeners();
        this.updateControlsVisibility();
    }

    initEventListeners() {
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        this.fetchInitialBtn.addEventListener('click', this.fetchGZFile.bind(this));
        this.fetchBtn.addEventListener('click', this.fetchGZFile.bind(this));
        this.decompressBtn.addEventListener('click', this.decompressFile.bind(this));
        this.compressBtn.addEventListener('click', this.compressFile.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadFile.bind(this));
        this.updateBtn.addEventListener('click', this.updateFileContent.bind(this));
    }

    updateControlsVisibility() {
        if (this.currentFile) {
            this.noFileControls.style.display = 'none';
            this.fileControls.style.display = 'block';
        } else {
            this.noFileControls.style.display = 'block';
            this.fileControls.style.display = 'none';
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.currentFile = file;
            this.updateControlsVisibility();
            this.readFile(file);
        }
    }

    readFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentFileData = e.target.result;
            this.displayFileContent(this.currentFileData);
        };
        reader.readAsArrayBuffer(file);
    }

    async fetchGZFile() {
        let url = prompt('Enter the URL of the GZ file:');
        if (!url) return;

        // Normalize URL to HTTPS
        url = this.normalizeUrl(url);

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            
            // Extract filename from the URL
            const filename = this.extractFilenameFromUrl(url);
            
            this.currentFileData = arrayBuffer;
            this.currentFile = new File([arrayBuffer], filename, { type: 'application/gzip' });
            this.displayFileContent(arrayBuffer);
            this.updateControlsVisibility();
        } catch (error) {
            alert('Error fetching file: ' + error.message);
        }
    }

    // New method to normalize URL to HTTPS
    normalizeUrl(url) {
        // Trim whitespace
        url = url.trim();

        // Remove 'http://' or 'https://' if present
        url = url.replace(/^(https?:\/\/)/, '');

        // Prepend 'https://'
        return 'https://' + url;
    }

    // New method to extract filename from URL
    extractFilenameFromUrl(url) {
        // Remove protocol and any query parameters
        const cleanUrl = url.replace(/^https?:\/\//, '').split('?')[0];
        
        // Get the last part of the URL path
        const pathParts = cleanUrl.split('/');
        const filename = pathParts[pathParts.length - 1] || 'fetched.gz';
        
        // Ensure .gz extension
        return filename.endsWith('.gz') ? filename : filename + '.gz';
    }

    displayFileContent(arrayBuffer) {
        try {
            const decompressed = decompress(new Uint8Array(arrayBuffer));
            const text = new TextDecoder().decode(decompressed);
            this.fileContent.value = text;
            this.currentFileData = decompressed;
        } catch (error) {
            this.fileContent.value = 'Unable to display file contents: ' + error.message;
        }
    }

    decompressFile() {
        if (!this.currentFileData) return;

        try {
            const decompressed = decompress(new Uint8Array(this.currentFileData));
            this.currentFileData = decompressed;
            const text = new TextDecoder().decode(decompressed);
            this.fileContent.value = text;
        } catch (error) {
            alert('Decompression error: ' + error.message);
        }
    }

    updateFileContent() {
        if (!this.currentFileData) return;

        try {
            const text = this.fileContent.value;
            this.currentFileData = new TextEncoder().encode(text);
            alert('Content updated. You can now compress or download.');
        } catch (error) {
            alert('Update error: ' + error.message);
        }
    }

    compressFile() {
        if (!this.currentFileData) return;

        try {
            const text = this.fileContent.value;
            const compressed = compress(new TextEncoder().encode(text));
            this.currentFileData = compressed;
            this.fileContent.value = 'File compressed. Click Download to save.';
        } catch (error) {
            alert('Compression error: ' + error.message);
        }
    }

    downloadFile() {
        if (!this.currentFileData) return;

        const blob = new Blob([this.currentFileData], { type: 'application/gzip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.currentFile ? this.currentFile.name : 'edited.gz';
        a.click();
        URL.revokeObjectURL(url);
    }

    resetEditor() {
        this.currentFile = null;
        this.currentFileData = null;
        this.fileContent.value = '';
        this.fileInput.value = '';
        this.updateControlsVisibility();
    }
}

// Initialize the GZ File Editor
new GZFileEditor();