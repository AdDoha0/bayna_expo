const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Добавляем поддержку веб-платформы
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Настройки для веб-версии
config.resolver.alias = {
  'react-native$': 'react-native-web',
};

module.exports = config; 