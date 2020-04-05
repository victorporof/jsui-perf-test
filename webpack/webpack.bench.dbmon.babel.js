import path from "path";

import HtmlWebPackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import merge from "webpack-merge";

import config from "./webpack.config.babel";

const DBMON = path.join(__dirname, "../src/benchmarks/suites/dbmon");

const DEFAULT_LIB = "react"; // react | preact | jsui | jsui-iframe | jsui-webrtc
const DEFAULT_IMPLEMENTATION = "react-basic"; // react-basic | react-scu
const DEFAULT_LAYOUT_CSS = "block+flex"; // block | flex | block+flex | table
const DEFAULT_TABLE_COUNT = 2;

export default (env = {}) =>
  merge(config(env), {
    entry: "./src/benchmarks/index.js",
    module: {
      rules: [
        {
          test: path.resolve(__dirname, "../js-repaint-perfs/ENV.js"),
          use: [{ loader: "exports-loader", options: { ENV: true } }],
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/benchmarks/index.html",
      }),
      new webpack.DefinePlugin({
        TABLE_COUNT: `${env.tableCount ?? DEFAULT_TABLE_COUNT}`,
      }),
    ],
    resolve: {
      alias: {
        ...{
          "react-basic": {
            benchmark: path.resolve(DBMON, "react-basic"),
          },
          "react-scu": {
            benchmark: path.resolve(DBMON, "react-scu"),
          },
        }[env.implementation ?? DEFAULT_IMPLEMENTATION],
        ...{
          react: {
            "containment.css": path.resolve(DBMON, "css/containment.local.css"),
          },
          preact: {
            "containment.css": path.resolve(DBMON, "css/containment.local.css"),
          },
          jsui: {
            "containment.css": path.resolve(DBMON, "css/containment.local.css"),
          },
          "jsui-iframe": {
            "containment.css": path.resolve(DBMON, "css/containment.remote.css"),
          },
          "jsui-webrtc": {
            "containment.css": path.resolve(DBMON, "css/containment.remote.css"),
          },
        }[env.lib ?? DEFAULT_LIB],
        ...{
          block: {
            "content.css": path.resolve(DBMON, "css/content.css"),
            "layout.css": path.resolve(DBMON, "css/layout-block.css"),
          },
          flex: {
            "content.css": path.resolve(DBMON, "css/content.css"),
            "layout.css": path.resolve(DBMON, "css/layout-flex.css"),
          },
          "block+flex": {
            "content.css": path.resolve(DBMON, "css/content.css"),
            "layout.css": path.resolve(DBMON, "css/layout-block+flex.css"),
          },
          table: {
            "content.css": path.resolve(DBMON, "css/content.css"),
            "layout.css": path.resolve(DBMON, "css/layout-table.css"),
          },
        }[env.layout ?? DEFAULT_LAYOUT_CSS],
      },
    },
  });
