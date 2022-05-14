// the file is used for jest testing & site building
// > 2%, make template string not compiled to concat, since it's not fast
const nodeCurrent = [['@babel/preset-env', { targets: { node: 'current' } }]];
const IEPresetEnv = [
  [
    '@babel/preset-env',
    {
      targets: '>2%, not IE 11',
    },
  ],
];
module.exports = {
  presets: process.env.NODE_ENV === 'test' ? nodeCurrent : IEPresetEnv,
  plugins: ['@vue/babel-plugin-jsx'],
  transformOn: true,
  optimize: false,
};
