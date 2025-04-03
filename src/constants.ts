export const LAST_PAGE_LOCATION = 'lastLocation';

// How often, in ms, nfts, balances, and transfers are automatically polled from backend
export const REFRESH_INTERVAL = 5 * 1000; // 5 seconds

// How often a user may press the refresh-button to manually refresh nfts, balances, and transfers.
// Prevents spamming the backend if user tries to keep pressing the button
export const REFRESH_BUTTON_DISABLED_TIME = 750; // 0.75 seconds
