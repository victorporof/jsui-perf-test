import HtmlWebPackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";

import config from "./webpack.config.babel";

export default (env = {}) =>
  merge(config(env), {
    entry: "./src/iframe/index.js",
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/iframe/index.html"
      })
    ],
    devServer: {
      host: "jsui-server.local",
      port: 3000,
      disableHostCheck: true
    }
  });
