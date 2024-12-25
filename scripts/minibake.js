function minibake(str) {
    str = str.length % 2 ? str + " " : str;
    let out = "";
    for(let i = 0; i < str.length; i += 2) {
        out += String.fromCharCode((str.charCodeAt(i) << 8) | str.charCodeAt(i + 1));
    }
    return out;
}

function convertText() {
    let conv = minibake(document.getElementById('input').value);
    document.getElementById('output').textContent = conv;
}

function copyText() {
    var sourceText = document.getElementById("input").value;
    document.getElementById("editor-default").value = sourceText;
}
