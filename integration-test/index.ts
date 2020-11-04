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

const terra = new LocalTerra();
const { test1, test2 } = terra.wallets;

async function main() {
  const {
    collector,
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

  //   const {
  //     collector,
  //     factory,
  //     gov,
  //     mint,
  //     staking,
  //     oracle,
  //     terraswapFactory,
  //     mirrorToken,
  //     mirrorLpToken,
  //     mirrorPair,
  //     appleLpToken,
  //     applePair,
  //     appleToken
  //   } = {
  //     collector: 'terra1ysfj3mgr2msdj60vvssdvydlqfm2sstt3zev3m',
  //     factory: 'terra15rpmhyw0072r7yd5q7zk2ftrq8wzgj9kvl6geh',
  //     gov: 'terra1r7sw6swq5r0xnzerwk69wv8wyqaqvqrf7qjgsj',
  //     mint: 'terra1xkaw6uxscqd0taujn97atjjuc8ualdanz8lz0a',
  //     staking: 'terra1yhh7ya8jfj7zpjdmkppka38njjft9yqxwd52zy',
  //     oracle: 'terra1w6sh8y6zydjxfmasw5dwdt9feertwd36z9lt4z',
  //     terraswapFactory: 'terra1d3jmemtx7jjww2nlleklaadlvgrsd26st9e33g',
  //     mirrorToken: 'terra192rdskzvdxrkwdve2l7pe46aw45ejz7qlexx3p',
  //     mirrorLpToken: 'terra1x3he4dae9guz2xasq7vlahe4h65fw6z8anu2v7',
  //     mirrorPair: 'terra1nhwldz5sjg3svf4kancnhzt4l9h2h9yuf8jrfj',
  //     appleLpToken: 'terra1xw0ch3mugaypkx3lal9cha85jqn3hsl3udy97c',
  //     applePair: 'terra1qhdl2u7xa54x0dn3jfy5dmjmpl2ec8zlm9mtzp',
  //     appleToken: 'terra1qgtjkmq43xumzu63q6tvfhyn7yganv2xeuttgz'
  //   };

  const MIR_INDEX = 0;
  const AAPL_INDEX = 1;
  const mirror = new Mirror({
    lcd: terra,
    key: test1.key,
    collector,
    factory,
    gov,
    mint,
    staking,
    oracle,
    terraswapFactory,
    mirrorToken,
    assets: [
      {
        name: 'Mirror Token',
        symbol: 'MIR',
        token: mirrorToken,
        lpToken: mirrorLpToken,
        pair: mirrorPair
      },
      {
        name: 'APPLE Derivative',
        symbol: 'AAPL',
        token: appleToken,
        lpToken: appleLpToken,
        pair: applePair
      }
    ]
  });

  const mirror2 = new Mirror({
    lcd: terra,
    key: test2.key,
    collector,
    factory,
    gov,
    mint,
    staking,
    oracle,
    terraswapFactory,
    mirrorToken,
    assets: [
      {
        name: 'Mirror Token',
        symbol: 'MIR',
        token: mirrorToken,
        lpToken: mirrorLpToken,
        pair: mirrorPair
      },
      {
        name: 'APPLE Derivative',
        symbol: 'AAPL',
        token: appleToken,
        lpToken: appleLpToken,
        pair: applePair
      }
    ]
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
    mirror.assets[AAPL_INDEX].token.increaseAllowance(applePair, int`6000000`),
    mirror.assets[AAPL_INDEX].pair.provideLiquidity([
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

  const balanceRes = await mirror.assets[AAPL_INDEX].lpToken.getBalance();
  assert(balanceRes.balance === '189736659');

  const tokenInfoRes = await mirror.assets[AAPL_INDEX].lpToken.getTokenInfo();
  assert(tokenInfoRes.total_supply === '189736659');

  // Bond AAPL LP token to staking contract
  console.log('Bond APPL LP token to staking contract');
  await execute(
    test1,
    mirror.staking.bond(
      appleToken,
      189736659,
      mirror.assets[AAPL_INDEX].lpToken
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
    mirror2.assets[AAPL_INDEX].pair.swap({
      info: { native_token: { denom: 'uusd' } },
      amount: int`1000000000`.toString()
    }, {})
  );

  const balanceRes2 = await mirror2.assets[AAPL_INDEX].token.getBalance();
  assert(balanceRes2.balance === '850716');

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

  const priceRes = await mirror.oracle.getPrice(appleToken);
  assert(priceRes.price === '1200');

  // Liquidiate auction with 0.854573 APPL
  console.log('Liquidiate Auction');
  await execute(
    test2,
    mirror2.mint.auction(
      1,
      {
        info: { token: { contract_addr: appleToken } },
        amount: int`850716`.toString()
      },
      mirror2.assets[AAPL_INDEX].token
    )
  );

  // Mint mirror token to generate staking rewards for APPL staking pool
  // Claim staking rewards
  console.log('Mint mirror token & claim reward');
  await execute(
    test1,
    mirror.factory.mint(appleToken),
    mirror.staking.withdraw(appleToken)
  );

  // Provide MIR liquidity
  console.log('Provide UST-MIR liquidity');
  await execute(
    test1,
    mirror.assets[MIR_INDEX].token.increaseAllowance(mirrorPair, 6000000),
    mirror.assets[MIR_INDEX].pair.provideLiquidity([
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

  const balanceRes3 = await mirror.assets[MIR_INDEX].lpToken.getBalance();
  assert(balanceRes3.balance === '189736659');

  const tokenInfoRes3 = await mirror.assets[MIR_INDEX].lpToken.getTokenInfo();
  assert(tokenInfoRes3.total_supply === '189736659');

  // Stake MIR LP token
  console.log('Stake MIR LP token');
  await execute(
    test1,
    mirror.staking.bond(
      mirrorToken,
      189736659,
      mirror.assets[MIR_INDEX].lpToken
    )
  );

  // Mint mirror token to generate staking rewards for MIR staking pool
  // Claim staking rewards
  console.log('Mint mirror token & claim reward');
  await execute(
    test1,
    mirror.factory.mint(mirrorToken),
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
