import 'dotenv/config';

export default {
    expo: {
        name: "bolt-expo-nativewind",
        slug: "bolt-expo-nativewind",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: { supportsTablet: true, bundleIdentifier: "com.yourcompany.boltexpo" },
        android: { package: "com.yourcompany.boltexpo", versionCode: 1 },
        web: { bundler: "metro", output: "single", favicon: "./assets/images/favicon.png" },
        plugins: ["expo-router", "expo-font", "expo-web-browser", "expo-localization"],
        experiments: { typedRoutes: true },
        extra: {
            SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
            SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
        },
    },
};
