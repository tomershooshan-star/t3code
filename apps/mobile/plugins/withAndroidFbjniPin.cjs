const { withProjectBuildGradle } = require("expo/config-plugins");

// react-native-shiki-engine depends on `com.facebook.fbjni:fbjni:+`, so Gradle resolves
// the newest fbjni (0.8.x) instead of the 0.7.0 react-native pins. fbjni 0.8 is built with
// NDK r28's libc++ and references __cxa_init_primary_exception, which the NDK r27
// libc++_shared.so we package doesn't export: the app then crashes at launch with
// "couldn't find DSO to load: libfbjni.so". Force every module onto react-native's version.

const MARKER = "// withAndroidFbjniPin";
const FBJNI_VERSION = "0.7.0";

const PIN_BLOCK = `
${MARKER}: keep fbjni on react-native's version (see plugins/withAndroidFbjniPin.cjs).
allprojects {
  configurations.all {
    resolutionStrategy.force "com.facebook.fbjni:fbjni:${FBJNI_VERSION}"
  }
}
`;

module.exports = function withAndroidFbjniPin(config) {
  return withProjectBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes(MARKER)) {
      config.modResults.contents += PIN_BLOCK;
    }
    return config;
  });
};
