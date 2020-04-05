import path from "path";

import HtmlWebPackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import merge from "webpack-merge";

import config from "./webpack.config.babel";

const SUITES = path.join(__dirname, "../src/benchmarks/suites");

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
            benchmark: path.resolve(SUITES, "dbmon/react-basic"),
          },
          "react-scu": {
            benchmark: path.resolve(SUITES, "dbmon/react-scu"),
          },
        }[env.implementation ?? DEFAULT_IMPLEMENTATION],
        ...{
          block: {
            "content.css": path.resolve(SUITES, "dbmon/css/content.css"),
            "layout.css": path.resolve(SUITES, "dbmon/css/layout-block.css"),
          },
          flex: {
            "content.css": path.resolve(SUITES, "dbmon/css/content.css"),
            "layout.css": path.resolve(SUITES, "dbmon/css/layout-flex.css"),
          },
          "block+flex": {
            "content.css": path.resolve(SUITES, "dbmon/css/content.css"),
            "layout.css": path.resolve(SUITES, "dbmon/css/layout-block+flex.css"),
          },
          table: {
            "content.css": path.resolve(SUITES, "dbmon/css/content.css"),
            "layout.css": path.resolve(SUITES, "dbmon/css/layout-table.css"),
          },
        }[env.layout ?? DEFAULT_LAYOUT_CSS],
      },
    },
  });
