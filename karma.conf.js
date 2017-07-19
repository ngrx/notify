var path = require('path');
var webpack = require('webpack');

module.exports = function(karma) {
  'use strict';

  karma.set({
    basePath: __dirname,

    frameworks: ['jasmine'],

    files: [
      { pattern: 'tests.js', watched: false }
    ],

    exclude: [],

    preprocessors: {
      'tests.js': ['coverage', 'webpack', 'sourcemap']
    },

    reporters: ['mocha', 'coverage-istanbul'],

    coverageIstanbulReporter: {
      dir: path.join(__dirname, 'coverage'),
      reports: [
        'html',
        'lcovonly',
        'json',
        'clover'
      ],
      fixWebpackSourcePaths: true
    },

    browsers: ['Chrome'],

    port: 9018,
    runnerPort: 9101,
    colors: true,
    logLevel: karma.LOG_INFO,
    autoWatch: true,
    singleRun: false,

    webpack: {
      devtool: 'inline-source-map',
      entry: undefined,
      resolve: {
        extensions: ['.ts', '.js'],
        modules: [
          path.join(__dirname),
          'node_modules'
        ]
      },
      module: {
        rules: [
          {
            test: /\.ts?$/,
            use: [
              {
                loader: 'ts-loader?target=es5&module=commonjs'
              }
            ]
          },
          {
            test: /\.(js|ts)$/,
            enforce: 'post',
            include: path.resolve(__dirname, 'lib'),
            exclude: [
              /\.(e2e|spec)\.ts$/,
              /node_modules/
            ],
            use: [
              {
                loader: 'istanbul-instrumenter-loader'
              }
            ]
          }
        ]
      },
      plugins: [
        new webpack.LoaderOptionsPlugin({
          options: {
            ts: {
              configFileName: './spec/tsconfig.json'
            }
          }
        })
      ]
    },

    webpackServer: {
      noInfo: true
    }
  });
};
