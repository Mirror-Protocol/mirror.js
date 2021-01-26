# Mirror.js

Mirror.js is a client SDK for building applications that can interact with Mirror Protocol from within JavaScript runtimes, such as web browsers, server backends, and on mobile through React Native.

You can find a reference of the Mirror.js API [here](https://mirror-protocol.github.io/mirror.js/).

## Getting Mirror.js

Mirror.js is available as a package on NPM and is intended to be used alongside Terra.js.

Add both:

- `@terra-money/terra.js`
- `@mirror-protocol/mirror.js`

To your JavaScript project's `package.json` as dependencies using your preferred package manager:

```sh
$ npm install -S @terra-money/terra.js @mirror-protocol/mirror.js
```

## Usage

### `Mirror` object

Mirror.js provides facilities for 2 main use cases:

- query: runs smart contract queries through LCD
- execute: creates proper `MsgExecuteContract` objects to be used in transactions

Both of these functions are accessible through the [`Mirror`](https://mirror-protocol.github.io/mirror.js/classes/mirror.html) object.

To create the Mirror object:

```ts
import { LCDClient } from '@terra-money/terra.js';
import { Mirror } from '@mirror-protocol/mirror.js';

// default -- uses Columbus-4 core contract addresses
const mirror = new Mirror();

// optional -- specify contract addresses and assets
const mirror = new Mirror({
  lcd: new LCDClient(...),
  key: new MnemonicKey(), // or other Terra.js-compliant key
  collector: 'terra1...',
  community: 'terra1...',
  factory: 'terra1...',
  gov: 'terra1...',
  mint: 'terra1...',
  oracle: 'terra1...',
  staking: 'terra1...',
  mirrorToken: 'terra1...',
  terraswapFactory: 'terra1...',
  assets: {
    MIR: {
      name: 'Mirror',
      symbol: 'MIR',
      token: 'terra1...', // Terraswap token contract
      lpToken: 'terra1...', // Terraswap LP token contract
      pair: 'terra1...', // Terraswap pair contract against UST
    },
    mAAPL: {
      name: 'Mirrored Apple, Inc. stock',
      symbol: 'mAAPL',
      token: 'terra1...', // Terraswap token contract
      lpToken: 'terra1...', // Terraswap LP token contract
      pair: 'terra1...', // Terraswap pair contract against UST
    },
    ...
  }
});
```

### Query

The `Mirror` object contains contract queries for all of the Mirror core contracts, which it will run against the provided `LCDClient.`

```ts
async function main() {
  const result = await mirror.factory.getConfig();
}

main().catch(console.error);
```

Each contract has various query operations, which you can discover in the reference [API documentation](https://mirror-protocol.github.io/mirror.js/).

### Executing

The `Mirror` object contains functions for generating proper `MsgExecuteContract` messages to be included in a transaction and broadcasted.

```ts
const wallet = mirror.lcd.wallet(mirror.key);

async function sendMIR() {
  const tx = await wallet.createAndSignTx({
    msgs: [mirror.mirrorToken.transfer('terra1...', 1_000_000)],
    fee: new StdFee(200_000, { uluna: 20_000_000 })
  });
  return await mirror.lcd.tx.broadcast(tx);
}

async function stakeLPTokens() {
  const { mAAPL } = mirror.assets;
  const tx = await wallet.createAndSignTx({
    msgs: [
      mirror.staking.bond(
        mAAPL.pair.contractAddress,
        500_000_000,
        mAAPL.lpToken
      )
    ],
    fee: new StdFee(200_000, { uluna: 20_000_000 })
  });
  return await mirror.lcd.tx.broadcast(tx);
}

async function main() {
  await sendMIR();
  await stakeLPTokens();
}

main().catch(console.error);
```

## License

This software is licensed under the Apache 2.0 license. Read more about it [here](./LICENSE).

© 2020 Mirror Protocol
