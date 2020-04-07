import path from "path";

import HtmlWebPackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";

import config from "./webpack.config.babel";

const DEFAULT_PIPE = "postmessage"; // postmessage | webrtc

export default (env = {}) =>
  merge(config(env), {
    entry: "./src/renderers/remote/index.js",
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/renderers/remote/index.html",
      }),
    ],
    resolve: {
      alias: {
        ...{
          postmessage: {
            receiver: path.resolve(__dirname, "../src/renderers/remote/receivers/postmessage"),
          },
          webrtc: {
            receiver: path.resolve(__dirname, "../src/renderers/remote/receivers/webrtc"),
          },
        }[env.pipe ?? DEFAULT_PIPE],
      },
    },
    devServer: {
      host: "jsui-server.local",
      port: 3000,
      disableHostCheck: true,
    },
  });
