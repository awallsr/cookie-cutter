document.addEventListener('DOMContentLoaded', function () {
  const cookieNameInput = document.getElementById('cookieNameInput');
  const saveButton = document.getElementById('saveButton');

  chrome.storage.local.get(['cookieName'], function (result) {
    if (result.cookieName) {
      cookieNameInput.value = result.cookieName;
    }
  });

  saveButton.addEventListener('click', function () {
    const cookieName = cookieNameInput.value.trim();
    if (cookieName) {
      chrome.storage.local.set({ cookieName: cookieName }, function () {
        showToast(`Saved. Ready to cut '${cookieName}'`);
      });
    } else {
      showToast('Please enter a cookie name.', 'red');
    }
  });
});

function showToast(message, color = 'green') {
  let toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.top = '10px';
  toast.style.padding = '10px';
  toast.style.backgroundColor = color;
  toast.style.color = 'white';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = '9999';
  document.body.appendChild(toast);

  setTimeout(function () {
    document.body.removeChild(toast);
  }, 3000);
}
