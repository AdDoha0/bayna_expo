const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Добавляем поддержку wasm (нужно для expo-sqlite на web)
config.resolver.assetExts = config.resolver.assetExts || [];
config.resolver.assetExts.push('wasm');
// Убираем wasm из sourceExts, если вдруг там появится
config.resolver.sourceExts = (config.resolver.sourceExts || []).filter(ext => ext !== 'wasm');

// Добавляем поддержку веб-платформы
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Настройки для веб-версии
config.resolver.alias = {
  'react-native$': 'react-native-web',
};

module.exports = config; 
