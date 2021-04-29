import {
  isTxError,
  LocalTerra,
  int,
  MsgExecuteContract,
  Wallet
} from '@terra-money/terra.js';
import * as fs from 'fs';
import { contractAddressesFile } from './lib';
import { Mirror } from '../src/client';
import { strict as assert } from 'assert';
import { UST } from '../src/utils/Asset';

const terra = new LocalTerra();
const { test1, test2 } = terra.wallets;

export async function testUserFlow() {

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
    appleToken,
    collateralOracle
  } = JSON.parse(fs.readFileSync(contractAddressesFile).toString())

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
    collateralOracle,
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
    collateralOracle,
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
