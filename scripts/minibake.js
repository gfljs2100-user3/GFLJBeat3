function minibake(str) {
    str = str.length % 2 ? str + " " : str;
    let out = "";
    for(let i = 0; i < str.length; i += 2) {
        out += String.fromCharCode((str.charCodeAt(i) << 8) | str.charCodeAt(i + 1));
    }
    arr = ["eval(unescape(escape`", out, "`.replace(/u(..)/g,"$1%")))"];
    return arr;
}

function convertText() {
    let conv = minibake(document.getElementById('input').value);
    document.getElementById('output').textContent = conv;
}
