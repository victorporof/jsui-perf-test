import path from "path";

import HtmlWebPackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";

import config from "./webpack.config.babel";

const DEFAULT_BENCH = "react-basic";

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
    ],
    resolve: {
      alias: {
        ...{
          "react-basic": {
            benchmark: path.resolve(__dirname, "../src/main/benchmark/react-basic")
          },
          "react-scu": {
            benchmark: path.resolve(__dirname, "../src/main/benchmark/react-scu")
          }
        }[env.bench ?? DEFAULT_BENCH]
      }
    },
    devServer: {
      disableHostCheck: true
    }
  });
