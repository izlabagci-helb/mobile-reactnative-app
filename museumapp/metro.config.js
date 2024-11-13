// Learn more https://docs.expo.io/guides/customizing-metro
/*const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} 
const config = getDefaultConfig(__dirname);
getDefaultConfig.resolver.assetExist.push('cjs');
module.exports = config;*/

/*const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} 
const config = getDefaultConfig(__dirname);

// You can customize your Metro config here without using 'assetExist'
module.exports = config;*/


const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, { isCSSEnabled: true })

module.exports = withNativeWind(config, { input: './global.css' })
