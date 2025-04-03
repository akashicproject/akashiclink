import axios from 'axios';

import { urls } from '../constants/urls';
import { history } from '../history';
import { akashicPayPath } from '../routing/navigation-tree';
import { lastPageStorage, NavigationPriority } from './last-page-storage';

const AppConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
};

/** For requests that don't need cookies */
export const axiosBasePublic = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/** For requests that need cookies */
export const axiosOwnerBase = axios.create({
  withCredentials: true,
  baseURL: AppConfig.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Any request that 401s (auth cookie expired or not set) should chuck user
 * out to the landing page screen, unless the current page has an IMMEDIATE navigation priority
 */
axiosOwnerBase.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (401 === error.response.status) {
      // Skip if already on landing page
      if (history.location.pathname === '/akashic') return;

      // Get the current page user in on from memory
      const currentPage = await lastPageStorage.get();
      // If current page is undefined, or required authentication, kick user to the landing page
      if (
        !currentPage ||
        currentPage.navigationPriority ===
          NavigationPriority.AWAIT_AUTHENTICATION
      ) {
        history.push(akashicPayPath(urls.akashicPay));
        window.location.reload();
      }
    } else {
      return Promise.reject(error);
    }
  }
);
