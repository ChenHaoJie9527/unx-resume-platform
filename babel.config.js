// the file is used for jest testing & site building
// > 2%, make template string not compiled to concat, since it's not fast
const nodeCurrent = [['@babel/preset-env', { targets: { node: 'current' } }]];
const presetEnv = [
  [
    '@babel/preset-env',
    {
      targets: {
        browsers: ['>2%, not IE 11', 'last 2 versions'],
        node: 6,
        modules: 'auto'
      },
      useBuiltIns: 'entry',
      corejs: {
        proposals: true
      }
    },
  ],
];
module.exports = {
  presets: process.env.NODE_ENV === 'test' ? nodeCurrent : presetEnv,
  plugins: ['@vue/babel-plugin-jsx'],
  transformOn: true,
  optimize: false,
};
