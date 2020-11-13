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

  // const {
  //   collector,
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
  //   collector: 'terra1prccergxz635x00knr57r3cvkxxfp2gzzzn5rf',
  //   factory: 'terra1ydzv3lktgxn800wn9w5d0nv6kmuxrgmcrm0qne',
  //   gov: 'terra1mswnp32ve3pfpxhx8lvgsxpqxp3y455n5kaers',
  //   mint: 'terra1f8hczm8knayrx08rkr62c9ndl7d3sjzvc58hhw',
  //   staking: 'terra12sa7ytya28f9d20szv6awk6ck5puzhcdrtqvcz',
  //   oracle: 'terra17ye528kgrvluz85djktmy3fnz7mpjlrdstvjs0',
  //   terraswapFactory: 'terra1sj33zc8v60tl58rgds9d8m8xg72aglxvqdr5d9',
  //   mirrorToken: 'terra137qrrar7q4a0n3n5czv2l0efr35utjjxd8v8vz',
  //   mirrorLpToken: 'terra1grh8tvd2nu02dq7shkz85senkpxfvaewsmcq7h',
  //   mirrorPair: 'terra18c797089mg4rwatfnga2ypkc6ukj0kah3hvat9',
  //   appleLpToken: 'terra1my765x5ymqh4xrn2228lv34d00ph5qh8jmw73z',
  //   applePair: 'terra1rkqtl95rgsrh3xq95u9382ww5x0rxvh4gvc8ag',
  //   appleToken: 'terra1gmqjyzdr447uehg8k27g6unyd4jfn5n0zsu5x2'
  // };

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
    mirror2.assets[AAPL_INDEX].pair.swap(
      {
        info: { native_token: { denom: 'uusd' } },
        amount: int`1000000000`.toString()
      },
      {}
    )
  );

  const balanceRes2 = await mirror2.assets[AAPL_INDEX].token.getBalance();
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
