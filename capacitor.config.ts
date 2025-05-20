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
    plugins: {
      SplashScreen: {
        launchAutoHide: true,
        launchShowDuration: 0,
        launchFadeOutDuration: 1,
        backgroundColor: '#000075',
        androidSplashResourceName: 'splash',
        androidScaleType: 'CENTER_CROP',
        showSpinner: false,
        androidSpinnerStyle: 'large',
        iosSpinnerStyle: 'small',
        spinnerColor: '#999999',
        splashFullScreen: true,
        splashImmersive: true,
        layoutName: 'launch_screen',
        useDialog: true,
      },
    },
  },
  server:
    process.env.IS_LIVE_RELOAD === 'true'
      ? {
          url: 'http://127.0.0.1:8100',
          cleartext: true,
        }
      : {
          allowNavigation: [
            'api.akashicscan.com',
            'api.staging-akashicscan.com',
            'api.testnet.akashicscan.com',
          ],
          ...(process.env.PLATFORM === 'ios' && {
            hostname:
              process.env.FLAVORS === 'staging'
                ? // DO NOT CHANGE THIS, IOS STORAGE USES THIS TO SAVE DATA
                  'api.staging-akashicpay.com'
                : 'api.akashicpay.com',
          }),
        },
};

export default config;
