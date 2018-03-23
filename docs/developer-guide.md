# Developer guide

We target operating systems >= Android 4.4 (API 19) and >= iOS 9.0.

[React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html)

## System requirements

iOS version can be run only on a macOS, while Android can be run on Linux, Windows and macOS.

Xcode >= 9.0 required for iOS build 

## Dev environment

Before starting, make sure you have [git](https://git-scm.com/) and
[Yarn](https://yarnpkg.com) installed.

Setting up a dev environment should be as simple as running the commands
below in your terminal:
```
git clone https://github.com/N3TC4T/artunis-mobile.git
cd artunis-mobile
yarn install
```

## Running on Android simulator
`Virtual Android device` can be created by using Android Studio
1. Navigate to `Tools/Android/AVD Manager`.
2. Click on `Create Virtual Device...` and choose the device to be used for testing
3. Click on `Next`.
4. Choose the Api level or image to be tested on and click `Next`.
5. Click on `Finished`.

Now a `Virtual Android device` has been created. running `react-native run-android` will launch a new terminal with the React Native
packager and open up the app in the active Virtual Device

## Running on Android device
USB debugging must be active on the Android Device.
1. Connect your Android device to PC
2. Running `react-native run-android` will build the application and install
the app on your android device


## Running on iOS simulator
`react-native run-ios` will launch a new terminal with the React Native
packager and open up the app in the iOS simulator.

It will also launch a browser tab in Chrome with the React Native debugger.
`console.log` statements in React Native will end up in the JS console on
this tab.

## Running on an iOS device
1. [Set up the dev environment](#setting-up-a-dev-environment)
2. Connect your iOS device
3. Within the repo, `$ open ios/Artunis.xcworkspace/` to open Xcode
4. Change BundleIdentifier for both Artunis and ArtunisTests to a
unique string, e.g. `<username>Artunis` in the 'General Tab' of your project.
5. Select your device as the `build target` (from [this guide](https://facebook.github.io/react-native/docs/running-on-device-ios.html))
6. Hit the `build and run` button (make sure your device is unlocked)
7. If it's the first time you're running the app, you need to trust the
developer and the app in `Settings > General > Device Management > Developer
App` - make sure you are connected to WiFi, as it often doesn't work with
mobile networks

If it's your first time installing an app on an iOS device, you need to
obtain Apple Developer credentials that will allow you to sign the app.
Register at https://developer.apple.com. Then use your Apple ID in Xcode
and choose it as your `Signing > Team` for both Artunis and ArtunisTests.

### Tips when running on your iOS device
When you change the BundleIdentifier and Team (required in order to run on a device),
it **will** modify your `.pbxproj` file, which you do **not** want unless you intend
to. For instance, if you linking a new dependency, your `.pbxproj` will be modified to
reflect the new changes.

If you are simply testing it on the iOS device, simply do not stage the said file to
be committed. On the other hand, if you are also adding a dependency, it is recommended
that you first `git commit` the dependency link modification itself, and then start
developing. This way, when you stage your intended changes, you can do a `git reset
path/to/.pbxproj` to discard any changes relating to the modification of the BundleIdentifier
and Team, and then continue to commit the rest of the files. When you prepare to push your
changes, you can just squash the initial commit with your later commits to retain a clean
commit history. This way, you won't have to deal with any merge conflicts or manual
deletion of the lines in your `.pbxproj` when you submit your code for a review.

## Formatting code using prettier

* Using atom editor - install the `prettier-atom` plugin
* Using the command line - run `yarn run prettier`
