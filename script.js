document.querySelector("#input-file").addEventListener("input", (e) => {
  const file = document.getElementById('input-file').files[0];
  const fr = new FileReader();
  fr.onload = function(e) {
    const fileContent = convertText(e.target.result);
    const outputBox = document.querySelector("#output");
    outputBox.innerHTML = fileContent
  }
  fr.readAsText(file);
});

document.querySelector("#convert-file").addEventListener("click", () => {
  convertVttToTxtAndDownload();
});

function convertVttToTxtAndDownload() {
  const file = document.getElementById('input-file').files[0];
  if (!file) {
    alert('No file chosen to convert to text. Please choose a .vtt file from your computer to convert.');
    return;
  }
  const fr = new FileReader();
  fr.onload = function(e) {
    const fileContent = convertText(e.target.result);
    const fileName = file.name.replace('.vtt', '.txt');

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.setAttribute('download', fileName);
    a.setAttribute('href', window.URL.createObjectURL(blob));
    a.click();
  }
  fr.readAsText(file);
}

document.querySelector("#download-file").addEventListener("click", () => {
  const outputBox = document.querySelector("#output");
  let fileContent = outputBox.innerText;

  if (fileContent.length < 1) {
    const inputBox = document.querySelector("#input");
    const inputText = inputBox.innerText;
    fileContent = convertText(inputText);
  }

  if (fileContent.length < 1 
      && document.getElementById('input-file').files.length > 0) {
    convertVttToTxtAndDownload();
    return;
  }

  if (fileContent.length < 1) {
    alert('Nothing to download! Please follow one of the options to input a .vtt file or copy/paste text from a transcript.');
    return;
  }

  const fileName = 'fus-transcript.txt';

  const blob = new Blob([fileContent], { type: 'text/plain' });
  const a = document.createElement('a');
  a.setAttribute('download', fileName);
  a.setAttribute('href', window.URL.createObjectURL(blob));
  a.click();
});

document.querySelector("#convert").addEventListener("click", convertTextFromInputBoxToOutputBox);

function convertTextFromInputBoxToOutputBox(event) {
  const inputBox = document.querySelector("#input");
  const outputBox = document.querySelector("#output");
  const inputText = inputBox.innerText;
  const result = convertText(inputText);
  outputBox.innerHTML = ("<p>" + result + "</p>");
}

function convertText(inputText) {
  const textList = inputText.split("\n");
  let result = "";
  let inQuotation = false;
  let inSingleQuotes = false;
  textList.forEach(line => {
    if (!line || line.startsWith("WEBVTT") || line.startsWith("NOTE")
        || !line.match(/[A-Za-z]/) || line.search("-->") >= 0) {
      // skip
    } else {
      // remove first quotes when they get repeated line after line
      // within a long quote
      if (inQuotation && line[0] === '"') {
        line = line.substring(1);
      } else if (inSingleQuotes && line[0] === "'") {
        line = line.substring(1);
      }

      result = result + line + " ";
      
      if (line[0] === "'") {
        inSingleQuotes = true;
      } else if (line[line.length-1] === "'") {
        inSingleQuotes = false;
      }
      if (line[0] === '"') {
        inQuotation = true;
      } else if (line[line.length-1] === '"') {
        inQuotation = false;
      }
    }
  });
  return result;
}

document.querySelector("#clear-above").addEventListener("click", () => {
  document.querySelector("#input").innerHTML = "";
});

document.querySelector("#clear-below").addEventListener("click", () => {
  document.querySelector("#output").innerHTML = "";
});