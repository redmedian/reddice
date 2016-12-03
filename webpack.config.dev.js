import path from 'path';

export default {
  // для чего нужен eval-source-map пока не понял
  devtools: 'eval-source-map',
  entry: path.join(__dirname, '/client/index.js'),
  output: {
    path: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'client'),
        loaders: [ 'babel' ]
      }
    ]
  },
  resolve: {
     extensions: [ '', '.js' ]
  }
}
