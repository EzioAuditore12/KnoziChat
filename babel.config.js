module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo'], 'nativewind/babel'],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './src',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'react-native-worklets/plugin',
    ],
  };
};
