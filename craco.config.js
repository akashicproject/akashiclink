/**
 * This configuration is here because of a long standing bug
 * in create-react-app (from which we use react-scripts build/start)
 * that prevents babel from resolving modules outside this directory
 *
 * https://github.com/facebook/create-react-app/issues/8987
 * https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/540#issuecomment-1185241955
 */

const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

module.exports = {
  productionSourceMap: false,
  webpack: {
    configure: (webpackConfig) => {
      // Grab the babel-loader
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName('babel-loader')
      );

      if (isFound) {
        // Add additional folders that are not processed by babel by default
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat([
          path.join(__dirname, '../backend/src'),
          path.join(__dirname, '../../packages/common-i18n/src'),
          path.join(__dirname, '../../packages/ui-lib/src'),
        ]);
      }

      // Inject loader for processing ts
      match.loader.options.presets = [
        ...match.loader.options.presets,
        '@babel/preset-typescript',
      ];

      return {
        ...webpackConfig,
        ...(process.env.REACT_APP_OPTIMISE === 'false'
          ? {
              optimization: {
                minimize: false,
                runtimeChunk: false,
                splitChunks: {
                  chunks(_) {
                    return false;
                  },
                },
              },
            }
          : {}),
      };
    },
  },
};
