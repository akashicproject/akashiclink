# Akashic Wallet

> Mobile app + browser extension

## Running

1. Install all packages and set env

```sh
cp .env.example .env # optionally edit .env to suit your needs
yarn install
```

2. Run build

```sh
yarn build
```

3. Go to `browser://extensions/` and activate **Developer Mode**.

4. Click **Load unpacked** and select the `build` folder. Extension should appear in browser.

5. For mobile preview, run

```sh
yarn start:dev
```
