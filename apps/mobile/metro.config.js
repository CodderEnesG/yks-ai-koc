const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// Drizzle migration'ları .sql dosyası olarak pakete gömülür.
config.resolver.sourceExts.push('sql');

// expo-sqlite web worker'ı wa-sqlite.wasm'ı asset olarak import ediyor.
config.resolver.assetExts.push('wasm');

// withUniwindConfig en dışta kalmalı.
module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind-types.d.ts',
});
