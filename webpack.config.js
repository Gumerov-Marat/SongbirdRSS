/* eslint-disable no-undef */
const TerserWebackPlugin = require('terser-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin'); 
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}) => {
  const isProd = env === 'production';
  const isDev = env === 'development';

  const getLoader = () => (isProd ? MiniCssExtractPlugin.loader : 'style-loader');

  const getPlugins = () => {
    const plugins = [
      //new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: './index.html',
      }),
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          files: './src/**/*.{ts,tsx,js,jsx}',
        },
      }),
    ];
    if (isProd) {
      /* plugins.push(new CleanWebpackPlugin()); */
      plugins.push(new MiniCssExtractPlugin({
        filename: '[name]-[hash:8].css',
      }));
      plugins.push(new BundleAnalyzerPlugin());
    }
    return plugins;
  };

  return {
    mode: isProd ? 'production' : isDev && 'development',
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
      path: path.join(__dirname, '/dist'),
      publicPath: isDev ? '/' : './',
      filename: 'main.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      plugins: [new TsconfigPathsPlugin({})],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },

            },
          ],
        },
        {
          enforce: 'pre',
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            emitError: true,
          },
        },
        {
          test: /\.(png|jpg|gif|jpeg|ico|svg)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name]-[sha1:hash:4].[ext]',
              outputPath: 'img',
              esModule: false,
            },
          }],
        },
        {
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
              name: '[name].[ext]',
            },
          }],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            { loader: getLoader() },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
          ],
        },
        {
          test: /\.css$/,
          use: [
            { loader: getLoader() },
            { loader: 'css-loader' },
          ],
        },
        {
          test: /\.mp3$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'audio',
            },
          }],
        },
      ],
    },

    plugins: getPlugins(),

    devServer: {
      open: true,
      historyApiFallback: true,
    },
    devtool: 'source-map',
  };
};
