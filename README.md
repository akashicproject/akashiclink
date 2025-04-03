# Akashic Wallet

> Mobile app + browser extension

## Installation

1. Install all packages and setup .env file

```sh
cp .env.example .env # optionally edit .env to suit your needs
cp .env.example .env.staging.local # If you need to build Android App. Copy as .env.production.local for production env
yarn install
```

## Running locally as Web

1. Start backend in `app/backend`
2. Run

```sh
yarn start:dev
```

3. You can use the following at root of the monorepo to start all at once

```sh
yarn start:all
```

## Running locally as Chrome extension

1. Build the extension with

```sh
yarn build
```

2. Go to `browser://extensions/` and activate **Developer Mode**.

3. Click **Load unpacked** and select the `build` folder. Extension should appear in browser.

4. For mobile preview, run

```sh
yarn start:dev
```

## Running locally as Android App

1. Install Android Studio, SDK v33 and virtual devices as instructed in [Ionic Doc](https://ionicframework.com/docs/v6/developing/android)
2. Build the App with

```sh
yarn build:android
```

3. Open the App automatically with

```shell
yarn serve:android
```

4. In Android Studio, click "Run" to run the app in virtual device
