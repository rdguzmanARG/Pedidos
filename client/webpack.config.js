var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var APP_DIR = path.resolve(__dirname, "client");
var BUILD_DIR = path.resolve(__dirname, "wwwroot");
var isDevServer = process.argv.find((v) => v.includes("webpack-dev-server"));

module.exports = (env) => {
  const pluginArray = [
    new ExtractTextPlugin({ filename: "css/style.css" }),
    new webpack.DefinePlugin({
      "process.env.BACKEND_URL": JSON.stringify(
        env.BACKEND_URL ? env.BACKEND_URL : "http://localhost:5000"
      ),
    }),
    new webpack.ContextReplacementPlugin(
      /moment[\\\/]locale$/,
      /^\.\/(en|de|cz|eu)$/
    ),
  ];

  // hot module replacement, for dev in local folder (webpack dev server)
  if (isDevServer) {
    pluginArray.push(new webpack.HotModuleReplacementPlugin());
    console.log("************ HMR ENABLED *****************");
  }

  return {
    entry: {
      index: APP_DIR + "/js/IndexMain.jsx",
    },
    output: {
      path: BUILD_DIR,
      filename: "js/bundle.js",
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.jsx?/,
          include: APP_DIR,
          loader: "babel-loader",
        },
        {
          test: /\.(png|jpg)$/,
          loader: "url-loader",
        },
        {
          test: /\.s?css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
              },
              {
                loader: "sass-loader",
                options: "sourceMap",
              },
            ],
          }),
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    plugins: pluginArray,

    devServer: {
      contentBase: "wwwroot",
      headers: { "Access-Control-Allow-Origin": "*" },
      historyApiFallback: {
        index: "index.html",
      },
      hot: true,
      inline: true,
    },
  };
};
