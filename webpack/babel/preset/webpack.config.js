const path = require('path');

module.exports = {
  mode: 'development',
  // context: path.resolve(__dirname, './src'),
  entry: {
    main: './src/index',
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    chrome: '97',
                  },
                  useBuiltIns: 'usage',
                  corejs: '3.20',
                  // useBuiltIns: 'usage',
                  // corejs: { version: '3.20', proposals: true },
                },
              ],
              // Since @babel/polyfill was deprecated in 7.4.0,
              // we recommend directly adding core- js and setting the version via the corejs option.
              // useBuiltIns: 'entry',
              // corejs: true,
            ],
          },
        },
      },
    ],
  },
};
