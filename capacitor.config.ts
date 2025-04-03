import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: process.env.ANDROID_APP_ID,
  appName: process.env.ANDROID_APP_NAME,
  webDir: 'build',
};

// eslint-disable-next-line import/no-default-export
export default config;
