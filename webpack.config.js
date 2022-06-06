module.exports = /** @type {import("webpack").Configuration} */ ({
  mode: "development",
  devtool: false,
  target: "web",
  output: {
    path: "/Users/carlos.precioso/Desktop/NewWork/webpack-url-asset/bundle",
  },
  module: {
    rules: [
      {
        test: /\.[mc]?js$/i,
        enforce: "pre",
        use: require.resolve("."),
      },
      {
        test: /\.(txt)$/i,
        use: {
          loader: "file-loader",
          options: { outputPath: "yes" },
        },
      },
    ],
  },
});
