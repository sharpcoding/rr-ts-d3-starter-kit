const _ = require("lodash");
const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  /*
    * app.ts represents the entry point to your web application. Webpack will
    * recursively go through every "require" statement in app.ts and
    * efficiently build out the application's dependency tree.
    */
  entry: ["./src"],
  /*
    * The combination of path and filename tells Webpack what name to give to
    * the final bundled JavaScript file and where to store this file.
    */
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.js"
  },
  /*
    * resolve lets Webpack now in advance what file extensions you plan on
    * "require"ing into the web application, and allows you to drop them
    * in your code.
    */
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CopyWebpackPlugin([{ from: './assets/json', dot: true }], { copyUnmodified: true })
  ],
  module: {
    /*
      * Each loader needs an associated Regex test that goes through each
      * of the files you've included (or in this case, all files but the
      * ones in the excluded directories) and finds all files that pass
      * the test. Then it will apply the loader to that file.
      */
    rules: [{
        test: /\.(ts|tsx)(\?.*)?$/,
        loaders: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: { limit: 8192 }
        }]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?|(jpg|gif)$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "../src")
    ],
    extensions: [".js", ".ts", ".json", ".jsx", ".tsx", ".css", ".scss"],
    alias: {
      "@components": path.resolve(__dirname, '../src/components'),
      "@screens": path.resolve(__dirname, '../src/screens'),
      "@store":  path.resolve(__dirname, '../src/store')
    }
  }
}