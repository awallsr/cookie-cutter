chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "copyToClipboard") {
    let value = request.value;
    let cookieName = request.cookieName;
    let timeRemaining = request.timeRemaining;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () {
        showCopySuccessToast(cookieName, timeRemaining);
      }, function (err) {
        console.error('Could not copy text: ', err);
        fallbackCopyTextToClipboard(value, cookieName, timeRemaining);
      });
    } else {
      fallbackCopyTextToClipboard(value, cookieName, timeRemaining);
    }
  } else if (request.action === "showToast") {
    showToast(request.message);
  }
});

function fallbackCopyTextToClipboard(text, cookieName, timeRemaining) {
  let textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
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
      showCopySuccessToast(cookieName, timeRemaining);
    } else {
      showToast(`Failed to copy cookie '${cookieName}'.`);
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    showToast(`Failed to copy cookie '${cookieName}'.`);
  }

  document.body.removeChild(textArea);
}

function showCopySuccessToast(cookieName, timeRemaining) {
  let message = `Cookie '${cookieName}' copied to clipboard.`;

  if (timeRemaining !== null) {
    let timeString = formatTimeRemaining(timeRemaining);
    message += ` Expires in ${timeString}.`;
  } else {
    message += ` (Session cookie)`;
  }

  showToast(message);
}

function formatTimeRemaining(timeInSeconds) {
  if (timeInSeconds <= 0) {
    return "expired";
  }

  let seconds = Math.floor(timeInSeconds % 60);
  let minutes = Math.floor((timeInSeconds / 60) % 60);
  let hours = Math.floor((timeInSeconds / (60 * 60)) % 24);
  let days = Math.floor(timeInSeconds / (60 * 60 * 24));

  let timeComponents = [];
  if (days > 0) {
    timeComponents.push(`${days}d`);
  }
  if (hours > 0) {
    timeComponents.push(`${hours}h`);
  }
  if (minutes > 0) {
    timeComponents.push(`${minutes}m`);
  }
  if (seconds > 0) {
    timeComponents.push(`${seconds}s`);
  }

  return timeComponents.join(' ');
}

function showToast(message) {
  // Create a div element for the toast
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
  toast.style.fontFamily = 'Arial, sans-serif';
  toast.style.fontSize = '14px';

  document.body.appendChild(toast);

  setTimeout(function () {
    document.body.removeChild(toast);
  }, 5000);
}
