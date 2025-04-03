import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: process.env.PACKAGE_NAME,
  appName: process.env.APP_NAME,
  webDir: 'build',
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  server: {
    allowNavigation: ['api.akashicpay.com', 'api.staging-akashicpay.com'],
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
