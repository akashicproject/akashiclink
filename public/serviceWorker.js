let webPort;
let lastPopupId;

const SHARED_PARAMS = ['type', 'method'];
const ETH_REQUEST_ACCOUNTS_PARAMS = ['uri', 'appName', 'appUrl', 'submittedAt'];
const PERSONAL_SIGN_PARAMS = ['appName', 'appUrl'];

//MUTATE query
const appendQuery = (query, request, list) => {
  list.forEach((param) => {
    query.append(param, request[param] ?? '');
  });
};

// ---- Upon receive single message within extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // forward message to AP
  if (sender.id === chrome.runtime.id) {
    webPort.postMessage(request);
  }
});

// ---- Upon receive single message outside extension
// chrome.runtime.onMessageExternal.addListener(function (
//   request,
//   sender,
//   sendResponse
// ) {
// });

// ---- Upon receive external connection request
chrome.runtime.onConnectExternal.addListener(function (port) {
  webPort = port;

  port.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type !== 'webPageRequest') {
      //TODO: handle other types
      port.postMessage({ received: request });
      return;
    }

    // Build the url for AW to determine which popup page to display
    const query = new URLSearchParams();
    appendQuery(query, request, SHARED_PARAMS);

    if (request.method === 'eth_requestAccounts') {
      appendQuery(query, request, ETH_REQUEST_ACCOUNTS_PARAMS);
    }
    if (request.method === 'personal_sign') {
      appendQuery(query, request, PERSONAL_SIGN_PARAMS);
    }

    // Do not create a new window but focus on the existing one if there is one
    try {
      const existing = await chrome.windows.get(lastPopupId);

      await chrome.windows.update(lastPopupId, {
        focused: true,
      });

    } catch (e) {

      const newWindow = await chrome.windows.create({
        focused: true,
        height: 720,
        width: 360,
        type: 'popup',
        url: `chrome-extension://${
          chrome.runtime.id
        }/index.html?${query.toString()}`,
      });

      lastPopupId = newWindow.id;
    }

  });
});
