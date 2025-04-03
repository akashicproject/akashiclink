/**
 * This configuration is here because of a long standing bug
 * in create-react-app (from which we use react-scripts build/start)
 * that prevents importing of enums through symlinks - in our case @helium/backend
 * is symlinked.
 *
 * https://github.com/facebook/create-react-app/issues/8987
 *
 * We override the webpack configuration to override the default config
 * TODO: check what kind of things are overriden
 */
module.exports = {
  webpack: {
    configure: (webpackConfig) => ({
      ...webpackConfig,
      ...(process.env.OPTIMISE === 'false'
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
      module: {
        ...webpackConfig.module,
        rules: webpackConfig.module.rules.map((rule) => {
          if (!rule.oneOf) return rule;
          return {
            ...rule,
            oneOf: rule.oneOf.map((ruleObject) => {
              if (
                !new RegExp(ruleObject.test).test('.ts') ||
                !ruleObject.include
              )
                return ruleObject;
              return { ...ruleObject, include: undefined };
            }),
          };
        }),
      },
    }),
  },
};
