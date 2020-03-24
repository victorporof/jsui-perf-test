import path from "path";

import HtmlWebPackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";

import config from "./webpack.config.babel";

export default (env = {}) =>
  merge(config(env), {
    entry: "./src/main/index.js",
    module: {
      rules: [
        {
          test: path.resolve(__dirname, "../js-repaint-perfs/ENV.js"),
          use: [{ loader: "exports-loader", options: { ENV: true } }]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/main/index.html"
      })
    ]
  });
