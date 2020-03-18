import path from "path";

import HtmlWebPackPlugin from "html-webpack-plugin";

export default env => ({
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" }
      },
      {
        test: /\.html$/,
        use: [{ loader: "html-loader" }]
      },
      {
        test: /\.shadow\.css$/,
        use: [{ loader: "to-string-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.css$/,
        exclude: /\.shadow\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      react: {
        react: "react",
        "react-dom": "react-dom"
      },
      preact: {
        react: "preact/compat",
        "react-dom": "preact/compat"
      },
      jsui: {
        react: path.resolve(__dirname, "src/lib/jsui.js"),
        "react-dom": path.resolve(__dirname, "src/lib/jsui-dom.js")
      }
    }[env.lib]
  }
});
