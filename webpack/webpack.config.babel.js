import path from "path";

import webpack from "webpack";

const DEFAULT_LIB = "react";
const DEFAULT_POLYFILL_MODE = "normal";
const DEFAULT_SYNC_MODE = "normal";

export default (env = {}) => ({
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.html$/,
        use: [{ loader: "html-loader" }]
      },
      {
        test: /\.css$/,
        exclude: /\.global\.css$/,
        use: [{ loader: "to-string-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.global\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      POLYFILL_MODE: `"${env.polyfill ?? DEFAULT_POLYFILL_MODE}"`,
      SYNC_MODE: `"${env.sync ?? DEFAULT_SYNC_MODE}"`
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      ...{
        react: {
          react: "react",
          "react-dom": path.resolve(__dirname, "../src/lib/compat/react-dom.js")
        },
        preact: {
          react: "preact/compat",
          "react-dom": path.resolve(__dirname, "../src/lib/compat/preact-dom.js")
        },
        jsui: {
          react: path.resolve(__dirname, "../src/lib/jsui/index.js"),
          "react-dom": path.resolve(__dirname, "../src/lib/jsui/jsui-dom.js")
        },
        "jsui-iframe": {
          react: path.resolve(__dirname, "../src/lib/jsui/index.js"),
          "react-dom": path.resolve(__dirname, "../src/lib/jsui/jsui-dom-iframe.js")
        },
        "jsui-webrtc": {
          react: path.resolve(__dirname, "../src/lib/jsui/index.js"),
          "react-dom": path.resolve(__dirname, "../src/lib/jsui/jsui-dom-webrtc.js")
        }
      }[env.lib ?? DEFAULT_LIB],
      ...{
        react: {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.local.css")
        },
        preact: {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.local.css")
        },
        jsui: {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.local.css")
        },
        "jsui-iframe": {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.remote.css")
        },
        "jsui-webrtc": {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.remote.css")
        }
      }[env.lib ?? DEFAULT_LIB]
    }
  }
});
