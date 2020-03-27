import path from "path";

import webpack from "webpack";

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
        test: /\.raw\.css$/,
        use: [{ loader: "to-string-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.css$/,
        exclude: /\.raw\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      POLYFILL: `"${env.polyfill}"`
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
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
      "jsui-remote": {
        react: path.resolve(__dirname, "../src/lib/jsui/index.js"),
        "react-dom": path.resolve(__dirname, "../src/lib/jsui/jsui-dom-remote.js")
      }
    }[env.lib]
  }
});
