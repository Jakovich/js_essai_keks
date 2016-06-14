'use strict';
var path = require('path');


module.exports = {
  
  devServer: {
    contentBase: './build'
 },
  
  entry: './src/main.js',
  
  output: {
    filename: "js/main.js",
    path: path.join(__dirname, 'build')
  },
  
  devtool: 'inline-source-map',
  
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src'),
        loader: 'babel-loader'
      }
    ],
    
  },
  
  resolve: {
    modulesDirectories: ['node_modules', './src']
  }
  
}
