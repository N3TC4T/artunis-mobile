# Getting Started

## Why React Native?

* Support iOS and Android with one codebase
* Familiar web programming model (React + Javascript + Flexbox)
* Cross-platform, 90% code reuse between iOS and Android platforms

## Running

Run Android:

* Install the Android SDK including API 23 (Android 6.0), Build Tools, API Platform, Google APIs, Google Play Services, Android Support Library, the Local Maven Repository for Support and the Google Repository.

All of these can be installed, together with their dependencies, using the Android SDK manager.
Alternate method: Open `artunis-mobile/android` in Android Studio, fix dependancy issues by installing all packages and run.

Run iOS:

* `yarn ios` - runs in an iOS simulator in the default supported device
(currently iPhone 6)

## Fix issues

If you are having issues running the code on your machine, either for the first time or after updating an outdated code with the latest, please run:

```
yarn run reinstall
```

Optionally, reset iOS simulator:

```
iOS Menu > Simulator > Reset Content and Settings…
```
