import path from "path";

import webpack from "webpack";

const DEFAULT_LIB = "react"; // react | preact | jsui | jsui-iframe | jsui-webrtc
const DEFAULT_POLYFILL_MODE = "normal"; // normal | force
const DEFAULT_SYNC_MODE = "normal"; // normal | strict
const DEFAULT_SERIALIZER = "identity"; // identity | json

export default (env = {}) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },
      {
        test: /\.html$/,
        use: [{ loader: "html-loader" }],
      },
      {
        test: /\.css$/,
        exclude: /\.global\.css$/,
        use: [{ loader: "to-string-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.global\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      POLYFILL_MODE: `"${env.polyfill ?? DEFAULT_POLYFILL_MODE}"`,
      SYNC_MODE: `"${env.sync ?? DEFAULT_SYNC_MODE}"`,
      ...{
        identity: {
          TRANSPORT_SERIALIZE: "v => v",
          TRANSPORT_DESERIALIZE: "v => v",
        },
        json: {
          TRANSPORT_SERIALIZE: "JSON.stringify",
          TRANSPORT_DESERIALIZE: "JSON.parse",
        },
      }[env.serializer ?? DEFAULT_SERIALIZER],
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      ...{
        react: {
          react: "react",
          "react-dom": "react-dom",
        },
        preact: {
          react: "preact/compat",
          "react-dom": "preact/compat",
        },
        jsui: {
          react: path.resolve(__dirname, "../src/lib/jsui/index.js"),
          "react-dom": path.resolve(__dirname, "../src/lib/jsui/jsui-dom.js"),
        },
        "jsui-iframe": {
          react: path.resolve(__dirname, "../src/lib/jsui/index.js"),
          "react-dom": path.resolve(__dirname, "../src/lib/jsui/jsui-dom-iframe.js"),
        },
        "jsui-webrtc": {
          react: path.resolve(__dirname, "../src/lib/jsui/index.js"),
          "react-dom": path.resolve(__dirname, "../src/lib/jsui/jsui-dom-webrtc.js"),
        },
      }[env.lib ?? DEFAULT_LIB],
      ...{
        react: {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.local.css"),
        },
        preact: {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.local.css"),
        },
        jsui: {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.local.css"),
        },
        "jsui-iframe": {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.remote.css"),
        },
        "jsui-webrtc": {
          "containment.css": path.resolve(__dirname, "../src/benchmarks/containment.remote.css"),
        },
      }[env.lib ?? DEFAULT_LIB],
    },
  },
  devServer: {
    disableHostCheck: true,
  },
});
