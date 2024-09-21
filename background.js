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

              // Send message to content script to copy the value and show toast
              chrome.tabs.sendMessage(tab.id, {
                action: "copyToClipboard",
                value: cookieValue,
                cookieName: cookieName
              });
            } else {
              // Show toast notification for missing cookie
              chrome.tabs.sendMessage(tab.id, {
                action: "showToast",
                message: `Cookie '${cookieName}' not found.`
              });
            }
          });
        });
      } else {
        // Prompt user to set the cookie name
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
