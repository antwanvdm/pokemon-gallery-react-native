# Pokémon Gallery - React Native
This project covers an app I've built with React native. During our programming
courses at the education we changed our "Mobile development" course from native
(Java on Android) to React Native. Biggest reason was to comply more with our 
overall program (a lot of Javascript development), as well as making it more 
user-friendly to start developing a mobile application.

My personal goal was to get more invested in React Native (and Expo) and master
the most important criteria. To do so, I created this app featuring Pokémon using
the popular [Pokémon API](https://pokeapi.co/).

## Features
The following features are part of the app:
- List view of Pokémon. Data is re-downloaded every 7 days to prevent overload.
  After the initial download, data is stored locally
- Every Pokémon can be added as favorite
- Every Pokémon can be viewed in detail to discover the Shiny version
- In the detailview you can add personal notes for the Pokémon. They can be
  unlocked with biometric authentication (or a passcode if not available,
  looking at you iOS :))
- Notes can also be edited, deleted or shared to other platforms (WhatsApp, etc)
- A map view with all Pokémon pointed at a location. Currently, this is always
  fixed in the centre of Rotterdam, The Netherlands. If data refreshed on a new
  download, the locations will be different again
- You can view a Pokémon directly on the map from the listview
- Within the map you can focus on your own location or focus on the overview of
  all Pokémon together
- Within the settings you can switch to dark mode
- Within the settings you can switch to 9 different languages
- Within the setting you can manually clear the storage or re-download data
- Within the settings you can switch on notifications for close-by Pokémon. Once
  walking (with the app in the background) you will receive notifications if
  Pokémon are within a 100-meter range of your location
- Once you click on a notification, you will zoom to the area of those Pokémon
- Within the setting screen you can also manually test if notifications work
- When pressing the list or map items while being on that view, you will go back
  to the original view (top of list, or zoomed out Pokémon)
- Re-opening the app will always remember favorites, notes, dark mode and language

## Run it yourself
To get this project up & running on your own laptop, follow these steps:
- Git clone the project
- Create an app.json with the contents mentioned below. You can remove the
  SECRET stuff as it's not relevant while working in the Expo Go app
- Run `npm install`
- Run `npm run start`
- Have fun!

## Deployment
One of the most important goals was to actually release an app. I didn't choose 
to use the Google Play Store as it's just a personal app, but I did end up with
and APK-build installed on my own device. The processes required are mostly the
same regarding permissions and API-keys.

2 files are therefore not pushed to git, but would require the following content:

- app.json:

```json
{
  "expo": {
    "name": "Pokémon Gallery",
    "slug": "pokemon-gallery-react-native",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_BACKGROUND_LOCATION", "USE_BIOMETRIC", "USE_FINGERPRINT"],
      "package": "com.antwanvdm.pokemongalleryreactnative",
      "googleServicesFile": "./google-services.json",
      "config": {
        "googleMaps": {
          "apiKey": "SECRET"
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "SECRET"
      }
    }
  }
}
```

- google-services.json

```json
{
  "project_info": {
    "project_number": "SECRET",
    "project_id": "SECRET",
    "storage_bucket": "SECRET"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "SECRET",
        "android_client_info": {
          "package_name": "com.antwanvdm.pokemongalleryreactnative"
        }
      },
      "oauth_client": [
        {
          "client_id": "SECRET",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "SECRET"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": [
            {
              "client_id": "SECRET",
              "client_type": 3
            }
          ]
        }
      }
    }
  ],
  "configuration_version": "1"
}
```
