function strEncodeUTF16(text) {
  var arr = [];
  for (var i = 0; i < text.length; i++) {
    arr[i] = text.charCodeAt(i);
  }
  return arr;
}

// Function to set text to an element by ID
function setTextById(id, text) {
  var element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  } else {
    console.log("Element with ID '" + id + "' not found.");
  }
}

// Function to encode text from input field
function encodeText() {
  var inputText = document.getElementById('inputText').value;
  var encodedArr = strEncodeUTF16(inputText);
  setTextById('output', encodedArr.join(', '));
}

// Function to generate a UTF-16 encoded string and display it
function generateUTF16Text() {
  var generatedText = "Example Text";  // You can change this to any default text
  var encodedArr = strEncodeUTF16(generatedText);
  setTextById('output', encodedArr.join(', '));
}
