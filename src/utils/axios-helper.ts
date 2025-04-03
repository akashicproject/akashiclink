import { Preferences } from '@capacitor/preferences';
import axios from 'axios';

import { urls } from '../constants/urls';
import { history } from '../history';
import { akashicPayPath } from '../routing/navigation-tabs';

const createAxiosInstance = (baseURL: string | undefined) => {
  return axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
};

export const axiosBase = createAxiosInstance(
  process.env.REACT_APP_API_BASE_URL
);
export const axiosBaseV1 = createAxiosInstance(
  process.env.REACT_APP_VERSION_ONE_API_BASE_URL
);

/**
 * Any request that 401s (auth cookie expired or not set) should chuck user
 * out to the landing page screen, unless the current page has an IMMEDIATE navigation priority
 */
axiosBase.interceptors.response.use(
  // Pass through valid responses
  (response) => response,
  async (error) => {
    if (401 === error.response.status) {
      // Skip if already on root page
      if (history.location.pathname.match(/^\/$|\/akashic$/)) return;

      await Preferences.remove({
        key: 'lastLocation',
      });
      history.push(akashicPayPath(urls.akashicPay));
    } else {
      return Promise.reject(error);
    }
  }
);
