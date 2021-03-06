import path from "path";

import HtmlWebPackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import merge from "webpack-merge";

import config from "./webpack.config.babel";

const TRIANGLE = path.join(__dirname, "../src/benchmarks/suites/triangle");

const DEFAULT_LAYOUT_CSS = "flex"; // floats | flex
const DEFAULT_RECURSION = 7;
const DEFAULT_UPDATE_INTERVAL = 1000;
const DEFAULT_BLOCKING_TIME = 1;

export default (env = {}, argv = {}) =>
  merge(config(env, argv), {
    entry: "./src/benchmarks/index.js",
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/benchmarks/index.html",
      }),
      new webpack.DefinePlugin({
        RECURSION: `${env.recursion ?? DEFAULT_RECURSION}`,
        UPDATE_INTERVAL: `${env.updateInterval ?? DEFAULT_UPDATE_INTERVAL}`,
        BLOCKING_TIME: `${env.blockingTime ?? DEFAULT_BLOCKING_TIME}`,
      }),
    ],
    resolve: {
      alias: {
        benchmark: path.resolve(__dirname, "../src/benchmarks/suites/triangle"),
        "containment.css": path.resolve(TRIANGLE, "css/containment.css"),
        "content.css": path.resolve(TRIANGLE, "css/content.css"),
        ...{
          floats: {
            "layout.css": path.resolve(TRIANGLE, "css/layout-floats.css"),
          },
          flex: {
            "layout.css": path.resolve(TRIANGLE, "css/layout-flex.css"),
          },
        }[env.layout ?? DEFAULT_LAYOUT_CSS],
      },
    },
  });
