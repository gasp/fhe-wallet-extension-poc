This is an experimental Wallet in a chrome extension.
It is not secure, **do not use in production**

# How to install

- run `npm i`
- run `cp .env.template .env` and edit `.env`

# How to run

- run `npm run dev`
- drop the `dist` folder into a `chrome://extensions/` window in Google Chrome

# Documentation

- [offscreen-service](src/libs/offscreen-service.md) is an abstraction of chrome messages between popup and offscreen
- it uses [fjevmjs](https://github.com/zama-ai/fhevmjs)

# Todo

- [x] Display current wallet address.
- [x] Show account balance in clear ETH
- [x] get gas price
- [x] make a transaction
- [x] Recent transaction history
- [x] Store private keys securely.
- [ ] Store previous transactions on local storage
- [x] integrate with encrytedERC20 smart contract
- [x] update vite config to handle with wasm
- [x] use with a contract on sepolia
- [x] add extension stuff (icons, manifesto...)
- [x] update vite config to copy extension stuff
- [x] adapt building
- [x] offload to offcreen
