fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android getNextVersionCode

```sh
[bundle exec] fastlane android getNextVersionCode
```



### android getNextReleaseName

```sh
[bundle exec] fastlane android getNextReleaseName
```



### android updateManifest

```sh
[bundle exec] fastlane android updateManifest
```



### android setVersionCodeVersionName

```sh
[bundle exec] fastlane android setVersionCodeVersionName
```



### android buildApk

```sh
[bundle exec] fastlane android buildApk
```



### android buildAab

```sh
[bundle exec] fastlane android buildAab
```



### android internal

```sh
[bundle exec] fastlane android internal
```

Build a new release and upload to play store

### android deploy

```sh
[bundle exec] fastlane android deploy
```

Deploy a new version to the Google Play

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
