const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

const nativeOnlyModules = new Set([
  '@powersync/react-native',
  '@powersync/op-sqlite',
  '@op-engineering/op-sqlite',
  'react-native-nitro-modules',
  'react-native-mmkv',
  'react-native-nitro-fetch',
  'react-native-nitro-crypto',
  'expo-secure-store',
  '@baronha/react-native-multiple-image-picker',
]);

const webOnlyModules = new Set([
  '@powersync/web',
  '@react-native-async-storage/async-storage',
  'expo-crypto',
  'expo-image-picker',
]);

const webModuleMappings = {
  'react-native': 'react-native-web',
  '@powersync/web': '@powersync/web/umd',
};

config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'mjs', 'cjs'];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    return {
      filePath: require.resolve(moduleName),
      type: 'sourceFile',
    };
  }

  if (platform === 'web') {
    // Ignore native-only modules on web
    if (nativeOnlyModules.has(moduleName)) {
      return { type: 'empty' };
    }

    // Map modules for web
    const mappedModule = webModuleMappings[moduleName];
    if (mappedModule) {
      return context.resolveRequest(context, mappedModule, platform);
    }
  } else {
    // Ignore web-only modules on native
    if (webOnlyModules.has(moduleName)) {
      return { type: 'empty' };
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
});
