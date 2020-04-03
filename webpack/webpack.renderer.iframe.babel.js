import HtmlWebPackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";

import config from "./webpack.config.babel";

export default (env = {}) =>
  merge(config(env), {
    entry: "./src/renderers/iframe/index.js",
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/renderers/iframe/index.html"
      })
    ],
    devServer: {
      host: "jsui-server.local",
      port: 3000,
      disableHostCheck: true
    }
  });
