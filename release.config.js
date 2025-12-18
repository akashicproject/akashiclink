const createReleaseConfig = require('../../release.config.js');

const platform = process.env.PLATFORM;

const getCustomTagFormat = (branchName) => {
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

  if (branchName === 'main') {
    return `${prefix}\${version}`;
  }
  return `${prefix}\${version}-${branchName}`;
};

module.exports = createReleaseConfig({
  packageName: 'wallet-extension',
  publishCmd:
    'cd ../.. && SEMANTIC_VERSION=${nextRelease.version} bash ci/scripts/deploy-wallet-extension.sh',
  monorepoDepends: ['apps/backend/src/modules/api-interfaces'],
  customTagFormat: getCustomTagFormat,
});
