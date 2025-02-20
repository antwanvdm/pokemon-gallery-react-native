export default {
  expo: {
    name: 'Pokémon Gallery',
    slug: 'pokemon-gallery-react-native',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      'supportsTablet': false,
      "bundleIdentifier": "com.antwanvdm.pokemongalleryreactnative"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_BACKGROUND_LOCATION', 'USE_BIOMETRIC', 'USE_FINGERPRINT', 'FOREGROUND_SERVICE', 'FOREGROUND_SERVICE_LOCATION', 'CAMERA_ROLL', 'MEDIA_LIBRARY'],
      package: 'com.antwanvdm.pokemongalleryreactnative',
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    plugins: [
      [
        "expo-location",
        {
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true
        }
      ],
      [
        "expo-media-library",
        {
          isAccessMediaLocationEnabled: true
        }
      ],
      [
        "expo-asset",
        {
          assets: ["app/utils/sql"]
        }
      ]
    ],
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro'
    },
    extra: {
      eas: {
        projectId: '45cd942b-7ecb-4fc9-a68b-a287c5a4ddb0'
      },
      googleMapsDirection: {
        apiKey: process.env.GOOGLE_MAPS_DIRECTIONS_API_KEY
      }
    }
  }
};