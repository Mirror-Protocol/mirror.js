import {
  isTxError,
  LocalTerra,
  int,
  MsgExecuteContract,
  Wallet
} from '@terra-money/terra.js';
import { deployContracts } from './deploy';
import { Mirror } from '../src/client';
import { strict as assert } from 'assert';
import { UST } from '../src/utils/Asset';

const terra = new LocalTerra();
const { test1, test2 } = terra.wallets;

async function main() {
  const {
    collector,
    community,
    factory,
    gov,
    mint,
    staking,
    oracle,
    terraswapFactory,
    mirrorToken,
    mirrorLpToken,
    mirrorPair,
    appleLpToken,
    applePair,
    appleToken
  } = await deployContracts();

  console.log(
    JSON.stringify({
      collector,
      community,
      factory,
      gov,
      mint,
      staking,
      oracle,
      terraswapFactory,
      mirrorToken,
      mirrorLpToken,
      mirrorPair,
      appleLpToken,
      applePair,
      appleToken
    })
  );

  // const {
  //   collector,
  //   community,
  //   factory,
  //   gov,
  //   mint,
  //   staking,
  //   oracle,
  //   terraswapFactory,
  //   mirrorToken,
  //   mirrorLpToken,
  //   mirrorPair,
  //   appleLpToken,
  //   applePair,
  //   appleToken
  // } = {
  //   collector: 'terra13hr68gqphentukncdeteusg7wje5r8uldjq9zz',
  //   community: 'terra170wypsqm0r9fhhcahmqekcm6002u3g0lvs4esz',
  //   factory: 'terra1nky8gam28qywfnuzu2ums3d8udz436h4s93qj5',
  //   gov: 'terra1l0v3e30wh3sc3vczd54cveaspccfdrf7840s4x',
  //   mint: 'terra1turhz7qjdktmyzm8nl9pxjvssdhpyfqlcndel3',
  //   staking: 'terra1vnw6t6z808zw3kkkn70hae24nmwzzv84zll0g4',
  //   oracle: 'terra15jwj8txx2uxewctt8a8s8hffpmusxardrm5r2p',
  //   terraswapFactory: 'terra1zexrt4r8gzjrpcfq584p0m2qh4g59nsetmedp8',
  //   mirrorToken: 'terra1nz3gs5a965hshztxwnqfud04en6tpy5tq8f6me',
  //   mirrorLpToken: 'terra1j4y5xtj7a63yzd0uj48larv0k7ejfrjry2pwse',
  //   mirrorPair: 'terra1847g0quusvtshhs6tf4zcm73hj0jkel8tw6vl9',
  //   appleLpToken: 'terra19z0ld5rhds3enqt0qfkh604856t6qfmsuv6dyz',
  //   applePair: 'terra1ykaf4san445tter6a4ht3wj8mt65zx5pyt6mcv',
  //   appleToken: 'terra1t6y44c88yt3kp682e7f8vjejzm4qcldz9evm9v'
  // };

  const mirror = new Mirror({
    lcd: terra,
    key: test1.key,
    collector,
    community,
    factory,
    gov,
    mint,
    staking,
    oracle,
    terraswapFactory,
    mirrorToken,
    assets: {
      MIR: {
        name: 'Mirror Token',
        symbol: 'MIR',
        token: mirrorToken,
        lpToken: mirrorLpToken,
        pair: mirrorPair
      },
      mAPPL: {
        name: 'APPLE Derivative',
        symbol: 'mAAPL',
        token: appleToken,
        lpToken: appleLpToken,
        pair: applePair
      }
    }
  });

  const mirror2 = new Mirror({
    lcd: terra,
    key: test2.key,
    collector,
    community,
    factory,
    gov,
    mint,
    staking,
    oracle,
    terraswapFactory,
    mirrorToken,
    assets: {
      MIR: {
        name: 'Mirror Token',
        symbol: 'MIR',
        token: mirrorToken,
        lpToken: mirrorLpToken,
        pair: mirrorPair
      },
      mAPPL: {
        name: 'APPLE Derivative',
        symbol: 'mAAPL',
        token: appleToken,
        lpToken: appleLpToken,
        pair: applePair
      }
    }
  });

  // Feed oracle price
  console.log('Feed AAPL oracle price');
  await execute(
    test1,
    mirror.oracle.feedPrice([
      {
        asset_token: appleToken,
        price: 1000.0
      }
    ])
  );

  // Open position
  console.log('Open UST-AAPL position');
  await execute(
    test1,
    mirror.mint.openPosition(
      {
        info: { native_token: { denom: 'uusd' } },
        amount: int`10000000000`.toString()
      },
      { token: { contract_addr: appleToken } },
      1.5
    )
  );

  // Deposit UST
  console.log('Deposit UST');
  await execute(
    test1,
    mirror.mint.deposit(int`1`, {
      info: { native_token: { denom: 'uusd' } },
      amount: int`10000000000`.toString()
    })
  );

  // Mint AAPL
  console.log('Mint AAPL');
  await execute(
    test1,
    mirror.mint.mint(int`1`, {
      info: { token: { contract_addr: appleToken } },
      amount: int`6666666`.toString()
    })
  );

  // Provide Liquidity
  console.log('Provide Liquidity UST-AAPL');
  await execute(
    test1,
    mirror.assets['mAPPL'].token.increaseAllowance(applePair, int`6000000`),
    mirror.assets['mAPPL'].pair.provideLiquidity([
      {
        info: { native_token: { denom: 'uusd' } },
        amount: int`6000000000`.toString()
      },
      {
        info: { token: { contract_addr: appleToken } },
        amount: int`6000000`.toString()
      }
    ])
  );

  const balanceRes = await mirror.assets['mAPPL'].lpToken.getBalance();
  assert(balanceRes.balance === '189736659');

  const tokenInfoRes = await mirror.assets['mAPPL'].lpToken.getTokenInfo();
  assert(tokenInfoRes.total_supply === '189736659');

  // Bond AAPL LP token to staking contract
  console.log('Bond APPL LP token to staking contract');
  await execute(
    test1,
    mirror.staking.bond(
      appleToken,
      189736659,
      mirror.assets['mAPPL'].lpToken
    )
  );

  const rewardInfo = await mirror.staking.getRewardInfo(
    test1.key.accAddress,
    appleToken
  );
  assert(rewardInfo.reward_infos[0].bond_amount == '189736659');

  // Buy 0.854573 AAPL with 1000 UST from the test2 account
  console.log('Buy APPL');
  await execute(
    test2,
    mirror2.assets['mAPPL'].pair.swap(
      {
        info: { native_token: { denom: 'uusd' } },
        amount: int`1000000000`.toString()
      },
      {}
    )
  );

  const balanceRes2 = await mirror2.assets['mAPPL'].token.getBalance();
  assert(balanceRes2.balance === '854572');

  // Update Oracle price to hold an auction
  console.log('Update oracle price');
  await execute(
    test1,
    mirror.oracle.feedPrice([
      {
        asset_token: appleToken,
        price: 1200.0
      }
    ])
  );

  const priceRes = await mirror.oracle.getPrice(
    appleToken,
    UST.native_token.denom
  );
  assert(priceRes.rate === '1200');

  // Liquidiate auction with 0.854573 APPL
  console.log('Liquidiate Auction');
  await execute(
    test2,
    mirror2.mint.auction(1, {
      info: { token: { contract_addr: appleToken } },
      amount: int`854572`.toString()
    })
  );

  // Mint mirror token to generate staking rewards for APPL staking pool
  // Claim staking rewards
  console.log('Mint mirror token & claim reward');
  await execute(
    test1,
    mirror.factory.distribute(),
    mirror.staking.withdraw(appleToken)
  );

  // Provide MIR liquidity
  console.log('Provide UST-MIR liquidity');
  await execute(
    test1,
    mirror.assets['MIR'].token.increaseAllowance(mirrorPair, 6000000),
    mirror.assets['MIR'].pair.provideLiquidity([
      {
        info: { native_token: { denom: 'uusd' } },
        amount: int`6000000000`.toString()
      },
      {
        info: { token: { contract_addr: mirrorToken } },
        amount: int`6000000`.toString()
      }
    ])
  );

  const balanceRes3 = await mirror.assets['MIR'].lpToken.getBalance();
  assert(balanceRes3.balance === '189736659');

  const tokenInfoRes3 = await mirror.assets['MIR'].lpToken.getTokenInfo();
  assert(tokenInfoRes3.total_supply === '189736659');

  // Stake MIR LP token
  console.log('Stake MIR LP token');
  await execute(
    test1,
    mirror.staking.bond(
      mirrorToken,
      189736659,
      mirror.assets['MIR'].lpToken
    )
  );

  // Mint mirror token to generate staking rewards for MIR staking pool
  // Claim staking rewards
  console.log('Mint mirror token & claim reward');
  await execute(
    test1,
    mirror.factory.distribute(),
    mirror.staking.withdraw(mirrorToken)
  );
}

async function execute(
  wallet: Wallet,
  ...msgs: MsgExecuteContract[]
): Promise<{
  [key: string]: string[];
}> {
  const tx = await wallet.createAndSignTx({
    msgs,
    gasPrices: { uluna: 0.015 },
    gasAdjustment: 1.4
  });

  const result = await terra.tx.broadcast(tx);

  if (isTxError(result)) {
    console.log(JSON.stringify(result));
    throw new Error(
      `Error while executing: ${result.code} - ${result.raw_log}`
    );
  }

  return result.logs[0].eventsByType.from_contract;
}

main();
