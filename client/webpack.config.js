var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var APP_DIR = path.resolve(__dirname, "client");
var BUILD_DIR = path.resolve(__dirname, "wwwroot");
var isDevServer = process.argv.find(v => v.includes("webpack-dev-server"));

module.exports = env => {
  const pluginArray = [
    new ExtractTextPlugin({ filename: "css/[name].css" }),
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify(
        env.API_URL ? env.API_URL : "https://localhost:5000"
      )
    })
  ];

  // hot module replacement, for dev in local folder (webpack dev server)
  if (isDevServer) {
    pluginArray.push(new webpack.HotModuleReplacementPlugin());
    console.log("************ HMR ENABLED *****************");
  }

  return {
    entry: {
      main: APP_DIR + "/css/main.scss",
      index: APP_DIR + "/js/IndexMain.jsx"
    },
    output: {
      path: BUILD_DIR,
      publicPath: "/",
      filename: "js/[name]-main.js"
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.jsx?/,
          include: APP_DIR,
          loader: "babel-loader"
        },
        {
          test: /\.s?css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: "sourceMap"
              },
              {
                loader: "sass-loader",
                options: "sourceMap"
              }
            ]
          })
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx"]
    },
    plugins: pluginArray,

    devServer: {
      contentBase: "wwwroot",
      headers: { "Access-Control-Allow-Origin": "*" },
      historyApiFallback: {
        index: "index.html"
      },
      hot: true,
      inline: true
    }
  };
};
