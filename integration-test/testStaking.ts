import { int } from '@terra-money/terra.js';
import { assert } from 'console';
import { Mirror } from '../src/client';
import { execute, terra } from './lib';

const { test1 } = terra.wallets;

export async function testStaking(mirror: Mirror) {
  const appleToken = mirror.assets.mAPPL.token.contractAddress || '';
  const applePair = mirror.assets.mAPPL.pair.contractAddress || '';
  const staking = mirror.staking.contractAddress || '';

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

  console.log('Query staking pool');
  const initialStakingPool = await mirror.staking.getPoolInfo(appleToken);
  const initialBondAmount = parseInt(initialStakingPool.total_bond_amount);

  // Open position
  console.log('Mint AAPL');
  const openRes = await execute(
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
  const mintAmount = parseInt(openRes['amount'][0]);

  const poolRes = await mirror.assets.mAPPL.pair.getPool();
  let poolRatio =
    parseInt(poolRes.assets[0].amount) / parseInt(poolRes.assets[1].amount);
  if (isNaN(poolRatio)) {
    poolRatio = 1;
  }

  const poolAsset = Math.trunc(mintAmount / 2) - 1;
  const poolUst = Math.trunc(poolAsset * poolRatio);

  // Provide Liquidity
  console.log('Provide Liquidity UST-AAPL');
  const provRes = await execute(
    test1,
    mirror.assets['mAPPL'].token.increaseAllowance(applePair, poolAsset),
    mirror.assets['mAPPL'].pair.provideLiquidity([
      {
        info: { native_token: { denom: 'uusd' } },
        amount: poolUst.toString()
      },
      {
        info: { token: { contract_addr: appleToken } },
        amount: poolAsset.toString()
      }
    ])
  );
  const lpTokenAmount = provRes['amount'][0];

  // Bond AAPL LP token to staking contract
  console.log('Bond APPL LP token to staking contract');
  await execute(
    test1,
    mirror.staking.bond(
      appleToken,
      lpTokenAmount,
      mirror.assets['mAPPL'].lpToken
    )
  );

  console.log('Adjust premium on AAPL');
  await execute(test1, mirror.staking.adjustPremium([appleToken]));

  console.log('Deposit reward');
  await execute(
    test1,
    mirror.staking.depositReward(appleToken, 1000000, mirror.assets.MIR.token)
  );

  console.log('Query staking pool again');
  const stakingPool = await mirror.staking.getPoolInfo(appleToken);
  assert(
    stakingPool.total_bond_amount ==
      (initialBondAmount + parseInt(lpTokenAmount)).toString()
  );

  console.log('Query reward info');
  const rewardInfo = await mirror.staking.getRewardInfo(
    test1.key.accAddress,
    appleToken
  );

  console.log('Withdraw rewards');
  await execute(test1, mirror.staking.withdraw(appleToken));

  console.log('Unbond tokens');
  await execute(
    test1,
    mirror.staking.unbond(appleToken, rewardInfo.reward_infos[0].bond_amount)
  );

  console.log('Auto stake provide liquidity for UST-AAPL');
  await execute(
    test1,
    mirror.assets['mAPPL'].token.increaseAllowance(staking, poolAsset)
  );
  const autoRes = await execute(
    test1,
    mirror.staking.autoStake(
      {
        info: { native_token: { denom: 'uusd' } },
        amount: poolUst.toString()
      },
      {
        info: { token: { contract_addr: appleToken } },
        amount: poolAsset.toString()
      }
    )
  );
  const lpTokenAmount2 = autoRes['share'][0];

  console.log('Query staking pool again');
  const stakingPool2 = await mirror.staking.getPoolInfo(appleToken);
  assert(
    stakingPool2.total_bond_amount == lpTokenAmount2
  );
}
