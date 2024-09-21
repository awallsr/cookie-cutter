chrome.commands.onCommand.addListener(function (command) {
  if (command === "copy_cookie_value") {
    chrome.storage.local.get(['cookieName'], function (result) {
      if (result.cookieName) {
        const cookieName = result.cookieName;

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          let tab = tabs[0];
          let url = tab.url;

          chrome.cookies.get({ url: url, name: cookieName }, function (cookie) {
            if (cookie) {
              let cookieValue = cookie.value;
              let expirationDate = cookie.expirationDate;

              let timeRemaining = null;
              if (expirationDate) {
                let currentTime = Date.now() / 1000; // in seconds
                timeRemaining = expirationDate - currentTime; // in seconds
              }

              chrome.tabs.sendMessage(tab.id, {
                action: "copyToClipboard",
                value: cookieValue,
                cookieName: cookieName,
                timeRemaining: timeRemaining
              });
            } else {
              chrome.tabs.sendMessage(tab.id, {
                action: "showToast",
                message: `Cookie '${cookieName}' not found.`
              });
            }
          });
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          let tab = tabs[0];
          chrome.tabs.sendMessage(tab.id, {
            action: "showToast",
            message: "Please set a cookie name in the extension popup."
          });
        });
      }
    });
  }
});
