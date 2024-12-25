function strEncodeUTF16() {
  var inputText = document.getElementById('inputText').value; // Get text from input field
  var arr = [];
  for (var i = 0; i < inputText.length; i++) {
    arr[i] = inputText.charCodeAt(i);
  }
  return arr;
}

// Function to set text to an element by ID
function setTextById(id, text) {
  var element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  } else {
  }
}

// Function to encode text from input field
function encodeText() {
  var encodedArr = strEncodeUTF16();
  setTextById('output', encodedArr.join(', '));
}
