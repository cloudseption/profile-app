const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  entry: ["babel-polyfill", "./src/client/index.js"],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "/src/client"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000"
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: [
      {
        context: [
          "/api",
          "/auth",
        ],
        target: "http://localhost:8080"
      },
      {
        context: [
          "**",
          "!/api",
          "!/auth",
        ],
        target: "http://localhost:3000",
        pathRewrite: {
          '^/.*': function (path, req) {
            // console.log("REWRITE");
            let output;
            if (/([^/])+\.([^/])+$/.test(path)) {
              // console.log('OTHER FILE');
              output = '/' + /([^/])*\/?$/.exec(path)[0];
            } else {
              // console.log('ENDPOINT - SEND TO INDEX.HTML');
              output = '/index.html';
            }
            // console.log(output);
            return output;
          }
        },
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico"
    })
  ]
};
