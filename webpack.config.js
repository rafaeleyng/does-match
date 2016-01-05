module.exports = {
  entry: './js/entry.js',
  output: {
    path: __dirname,
    filename: './bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }
    ]
  }
};
