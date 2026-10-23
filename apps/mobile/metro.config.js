const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// Drizzle migration'ları .sql dosyası olarak pakete gömülür.
config.resolver.sourceExts.push('sql');

// withUniwindConfig en dışta kalmalı.
module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind-types.d.ts',
});
