# Akashic Wallet

> Mobile app + browser extension

## Warnings

- Chrome extension does not support page reloads - whenever added a reload, perform a platform check as so:

```ts
import { isPlatform } from '@ionic/react';
...
isPlatform('mobile') && location.reload();
```

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

1. Build the extension by first building the full app (it moves the `manifest.json` file to the correct location), and then run the dev build

```sh
yarn build
yarn build:dev
```

2. Go to `browser://extensions/` and activate **Developer Mode**.

3. Click **Load unpacked** and select the `build` folder. Extension should appear in browser.

4. Source file updates will take around 5-6 seconds to recompile. [See here](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#reload) for information of when the extensions needs reloading.

## Building Chrome extension for production

1. Set the `.env` with

```text
REACT_APP_PUBLIC_URL=https://api.akashicpay.com
REACT_APP_API_BASE_URL=https://api.akashicpay.com/api/v0
```

2. Build extension

```shell
yarn build
```

3. Zip the `build` folder

## Running locally as Android App

1. Install Android Studio, SDK v33 and virtual devices as instructed in [Ionic Doc](https://ionicframework.com/docs/v6/developing/android)
2. Build the App with

```sh
yarn sync:android
```

3. Open the App automatically with

```shell
yarn serve:android
```

4. In Android Studio, click "Run" to run the app in virtual device
