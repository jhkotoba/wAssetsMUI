const HtmlWebpackPlugin = require('html-webpack-plugin');
const port = process.env.PORT || 9050;

module.exports = {
    mode: 'development',
    entry: './src/assets/index/index.js',
    output: {
      filename: 'bundle.[hash].js'
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: {
                  minimize: true,
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: 'src/assets/index/index.html',
        })
      ],
      devServer: {
        host: 'localhost',
        port: port,
        open: true,
      },
  };