const getBranchName = () => {
  return (
    process.env.CI_COMMIT_REF_NAME ||
    process.env.CI_COMMIT_BRANCH ||
    process.env.BRANCH_NAME ||
    'main'
  );
};

const getTagFormat = (branchName, platform) => {
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

const currentBranch = getBranchName();
const platform = process.env.PLATFORM;

module.exports = {
  extends: 'semantic-release-monorepo',
  branches: ['main', 'preprod', 'staging'],
  repositoryUrl: 'https://gitlab.com/dreamsai/cpg-2/HeliumPay-monorepo',
  tagFormat: getTagFormat(currentBranch, platform),
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          {
            type: 'chore',
            release: 'patch',
          },
          {
            type: 'enh',
            release: 'patch',
          },
          {
            type: 'refactor',
            release: 'patch',
          },
          {
            type: 'hotfix',
            release: 'patch',
          },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/gitlab',
      {
        successCommentCondition: false,
      },
    ],
    [
      '@semantic-release/exec',
      {
        publishCmd:
          'cd ../.. && SEMANTIC_VERSION=${nextRelease.version} bash ci/scripts/deploy-wallet-extension.sh',
      },
    ],
  ],
  monorepo: {
    dependencies: [
      'packages/common-i18n',
      'apps/backend/src/modules/api-interfaces',
    ],
  },
};
