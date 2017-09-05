'use strict'

var path = require('path');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './main.js',
  output: { 
    path: __dirname,
    filename: 'build.js'
   },

   plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV)
      })
   ],

  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }, 
       {
         test: /\.css$/,
         loaders: ["style-loader","css-loader"]
       }   
    ]
  }

  

};
