const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
  entry: {
    main: './example/main',
    vendor: './example/vendor',
    polyfills: './example/polyfills'
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /\.d\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      compress: {
          warnings: false
      },
      comments: false
    }),
    new CommonsChunkPlugin({
      names: ['vendor', 'polyfills'],
      filename: '[name].js'
    })
  ]
};
