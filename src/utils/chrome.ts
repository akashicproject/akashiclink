export const closePopup = async () => {
  const current = await window.chrome.windows.getCurrent();
  current.id && (await window.chrome.windows.remove(current.id));
};

export const responseToSite = async (response: unknown) => {
  // Message is forwarded via serviceWorker
  await chrome.runtime.sendMessage(chrome.runtime.id, response);
};
