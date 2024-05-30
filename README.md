# Pokémon Gallery - React Native

This project covers an app I've built with React native. During our programming
courses at the education we changed our "Mobile development" course from native
(Java on Android) to React Native. Biggest reason was to comply more with our
overall program and work field (a lot of Javascript development), as well as making
it more user-friendly to start developing a mobile application.

My personal goal was to get more invested in React Native (and Expo) and master
the most important criteria. To do so, I created this app featuring Pokémon using
the popular [Pokémon API](https://pokeapi.co/). I actually created it in web React
before, just to get more into React. Once finished I ported it to React Native
and added a lot of features to make it a cool app.

## Features

The following features are part of the app:

- List view of Pokémon. Data is re-downloaded every 7 days to prevent overload.
  After the initial download, data is stored locally
- Every Pokémon can be added as favorite
- Every Pokémon can be viewed in detail to discover the Shiny version
- In the detailview you can add personal notes for the Pokémon. They can be
  unlocked with biometric authentication (or a passcode if not available,
  looking at you iOS simulator :))
- Notes can also be edited, deleted or shared to other platforms (WhatsApp, etc)
- A map view with all Pokémon pointed at a location. Currently, this is always
  fixed in the centre of Rotterdam, The Netherlands. If data refreshed on a new
  download, the locations will be different again
- You can view a Pokémon directly on the map from the listview
- Within the map you can focus on your own location or focus on the overview of
  all Pokémon together
- Within the map you can press a Pokémon. When the Pokémon is close (100 meters
  max) you get the details. If it's further, you get the option to navigate to
  the Pokémon with Google Maps walking directions
- Within the settings you can switch to dark or light mode
- Within the settings you can switch to 9 different languages
- Within the setting you can manually clear the storage or re-download data
- Within the settings you can switch on notifications for close-by Pokémon. Once
  walking (with the app in the background) you will receive notifications if
  Pokémon are within a 100-meter range of your location
- Once you click on a notification, you will zoom to the area of those Pokémon
- Within the setting screen you can also manually test if notifications work
- When pressing the list or map items while being on that view, you will go back
  to the original view (top of list, or zoomed out Pokémon)
- The app contains some smooth animations on the Pokémon cards to smoothen the
  experience
- Re-opening the app will always remember favorites, notes, dark mode and language

## Technical highlights

Some implementation were pretty cool and worth highlighting with some in-depth
technical description:

- Multilingual implementation is pretty cool. I learned that React Native has no
  problem with Japanese, Chinese and Arabic. The latter even enabled RTL views
  on some Android components. I used the famous [i18n library](https://www.npmjs.com/package/i18n-js)
  and combined it with some custom code to have a `t()` wrapper available
- Using the [reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/)
  library works pretty smooth. My main concern with animation would be that the
  code would require a lot of overhead, but this library handles it very smooth
- It was my first time using the [Context API](https://react.dev/reference/react/useContext)
  and I like it. Using a main provider on top of you components give you the
  flexibility to handle data centrally, as well as communicating with your AsyncStorage
- Google Maps doesn't support a native Dark Mode (Apple Maps does!), which challenged
  me to implement [custom map styles](https://mapstyle.withgoogle.com/). Pretty easy
  to create and implemented, as it's JSON-based
- Using Icons gives you multiple options. I ended up using the expo package with an
  [easy interface](https://icons.expo.fyi/) to find my icons
- When actually building my app I needed real keys for Google Maps and Firebase
  (notifications). While the cloud console is easy to use (once your creditcard is
  connected..), it still costs some effort to get it running (see [Deployment](#deployment))
- Building the route directions functionality required me to have a default API key from
  the Google Cloud console to do API calls. Building the View was more difficult as I
  wanted to have the BottomSheet like in the native Google Maps app. I ended up using the
  [BottomSheet package](https://ui.gorhom.dev/components/bottom-sheet/), combined with
  [WebView](https://github.com/react-native-webview/react-native-webview) and
  [AutoHeightWebView](https://www.npmjs.com/package/react-native-autoheight-webview) to
  display the HTML instructions from the API
- Notifications were probably the most complex in the whole app. Specifically
  configuring the background tasks was difficult. I'm very happy it turned out good,
  even though I'm still confused why it doesn't work with the app killed. I combined
  [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) with
  [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) (make sure to
  configure the right permissions in the config)
- The performance was also a thing for the Flatlist. It's a list with 251 items,
  which could eventually become more. Updating 1 detail in 1 component shouldn't
  update every instance of the component. I eventually used the React Memo
  functionality (`export default memo(PokemonCard, areEqual);`) to always check if a
  property is the same, and else prevent the re-render (see PokemonCard.js)
- For the styling I decided to use [NativeWind](https://www.nativewind.dev/). As
  someone who loves TailWind, this definitely made me happy and gave me a solid
  developer experience. Only downside are some (community) components that are not
  completely optimised to tailwind, so you might need some custom styling
- Released the app via the [EAS CLI tool](https://docs.expo.dev/build/setup/). It
  required registering, publishing and working with [EAS secrets](https://docs.expo.dev/build-reference/variables/#using-secrets-in-environment-variables).
  I also needed to set up a Google Cloud API to be able to use the Maps in a build.

## Run it yourself with Expo Go

To get this project up & running on your own laptop, follow these steps:

- Git clone the project
- Create an `.env` file with the contents mentioned below

```dotenv
GOOGLE_MAPS_API_KEY=YOUR_KEY
GOOGLE_MAPS_DIRECTIONS_API_KEY=YOUR_KEY
```

- Run `npm install`
- Run `npm run start`
- Have fun!

## Deployment

One of the most important goals was to actually release an app. I didn't choose
to use the Google Play Store as it's just a personal app, but I did end up with
and APK-build installed on my own device. The processes required are mostly the
same regarding permissions and API-keys. I've used the [EAS tool](https://docs.expo.dev/build/setup/)
from Expo to build and download the app.

If you want to create a build with EAS, you need:

- A `google-services.json` generated from your Google Cloud console (see the bottom
  of this file how it looks)
- Change the projectId in the `app.config.js` to your own Expo project ID
- Run the following 2 commands, before you run `eas build -p android --profile preview`:

```bash
eas secret:push --scope project --env-file .env
eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value .google-services.json
```

Example of google-services.json (SECRET values are present when you download your own)

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
