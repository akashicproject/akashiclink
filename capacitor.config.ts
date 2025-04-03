import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

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
    Keyboard: {
      resize: KeyboardResize.Native,
      style: KeyboardStyle.Dark,
      // resizeOnFullScreen: true,
    },
  },
  server: {
    allowNavigation: ['api.akashicpay.com', 'api.staging-akashicpay.com'],
    ...(process.env.PLATFORM === 'ios' && {
      hostname:
        process.env.FLAVORS === 'staging'
          ? 'api.staging-akashicpay.com'
          : 'api.akashicpay.com',
    }),
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
