import path from "path";

import HtmlWebPackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import merge from "webpack-merge";

import config from "./webpack.config.babel";

const DEFAULT_TABLE_COUNT = 2;

const DEFAULT_LIB = "react";
const DEFAULT_BENCH = "react-basic";
const DEFAULT_LAYOUT_CSS = "block+flex";

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
      }),
      new webpack.DefinePlugin({
        TABLE_COUNT: `${env.tableCount ?? DEFAULT_TABLE_COUNT}`
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
        }[env.bench ?? DEFAULT_BENCH],
        ...{
          block: {
            contentCss: path.resolve(__dirname, "../src/main/css/content.raw.css"),
            layoutCss: path.resolve(__dirname, "../src/main/css/layout-block.raw.css")
          },
          flex: {
            contentCss: path.resolve(__dirname, "../src/main/css/content.raw.css"),
            layoutCss: path.resolve(__dirname, "../src/main/css/layout-flex.raw.css")
          },
          "block+flex": {
            contentCss: path.resolve(__dirname, "../src/main/css/content.raw.css"),
            layoutCss: path.resolve(__dirname, "../src/main/css/layout-block+flex.raw.css")
          },
          table: {
            contentCss: path.resolve(__dirname, "../src/main/css/content.raw.css"),
            layoutCss: path.resolve(__dirname, "../src/main/css/layout-table.raw.css")
          }
        }[env.layout ?? DEFAULT_LAYOUT_CSS],
        ...{
          react: {
            containmentCss: path.resolve(__dirname, "../src/main/css/containment.local.raw.css")
          },
          preact: {
            containmentCss: path.resolve(__dirname, "../src/main/css/containment.local.raw.css")
          },
          jsui: {
            containmentCss: path.resolve(__dirname, "../src/main/css/containment.local.raw.css")
          },
          "jsui-remote": {
            containmentCss: path.resolve(__dirname, "../src/main/css/containment.remote.raw.css")
          }
        }[env.lib ?? DEFAULT_LIB]
      }
    },
    devServer: {
      disableHostCheck: true
    }
  });
