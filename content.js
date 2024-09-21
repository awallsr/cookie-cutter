chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "copyToClipboard") {
    let value = request.value;
    let cookieName = request.cookieName;

    // Copy value to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () {
        // Show toast notification
        showToast(`Cookie '${cookieName}' copied to clipboard.`);
      }, function (err) {
        console.error('Could not copy text: ', err);
        fallbackCopyTextToClipboard(value, cookieName);
      });
    } else {
      fallbackCopyTextToClipboard(value, cookieName);
    }
  } else if (request.action === "showToast") {
    showToast(request.message);
  }
});

function fallbackCopyTextToClipboard(text, cookieName) {
  let textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    let successful = document.execCommand('copy');
    if (successful) {
      showToast(`Cookie '${cookieName}' copied to clipboard.`);
    } else {
      showToast(`Failed to copy cookie '${cookieName}'.`);
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    showToast(`Failed to copy cookie '${cookieName}'.`);
  }

  document.body.removeChild(textArea);
}

function showToast(message) {
  let toast = document.createElement('div');
  toast.textContent = message;
  // Style the toast
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '20px';
  toast.style.padding = '10px';
  toast.style.backgroundColor = 'black';
  toast.style.color = 'white';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = '9999';
  document.body.appendChild(toast);

  setTimeout(function () {
    document.body.removeChild(toast);
  }, 3000);
}
