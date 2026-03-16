import createReleaseConfig from '../../release.config.mjs';

const platform = process.env.PLATFORM;

const getCustomTagFormat = () => {
  let prefix;
  if (platform === 'android') {
    prefix = 'android-v';
  } else if (platform === 'ios') {
    prefix = 'ios-v';
  } else if (platform === 'chrome-extension') {
    prefix = 'chrome-extension-v';
  } else {
    prefix = 'wallet-extension-v';
  }

  return `${prefix}\${version}`;
};

export default createReleaseConfig({
  packageName: 'wallet-extension',
  publishCmd:
    'cd ../.. && SEMANTIC_VERSION=${nextRelease.version} bash ci/scripts/deploy-wallet-extension.sh',
  monorepoDepends: ['apps/backend/src/modules/api-interfaces', 'packages/core-lib'],
  customTagFormat: getCustomTagFormat,
});
