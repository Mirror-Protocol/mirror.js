import {
  int,
} from '@terra-money/terra.js';
import { assert } from 'console';
import { Mirror } from '../src/client';
import { execute, terra } from './lib';

const { test1 } = terra.wallets;

export async function testLock(mirror: Mirror) {

  const appleToken = mirror.assets.mAPPL.token.contractAddress || "";

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

  // open a short position on mint contract, should lock the outcome of seling the asset
  console.log('OPEN SHORT POSITION ON AAPL');

  let openRes = await execute(
    test1,
    mirror.mint.openPosition(
      {
        info: { native_token: { denom: 'uusd' } },
        amount: int`10000000`.toString()
      },
      { token: { contract_addr: appleToken } },
      1.8,
      {
        short_params: {
          belief_price: undefined,
          max_spread: undefined
        }
      }
    )
  );
  const positionIdx = openRes['position_idx'][0];
  // query
  console.log("QUERYING LOCKED POSITION")
  const lockRes = await mirror.lock.getPositionLockInfo(positionIdx);
  assert(lockRes.locked_funds.length == 1);
  assert(openRes['locked_amount'][0] == lockRes.locked_funds[0][1]+"uusd");
  assert(openRes['lock_time'][0] == lockRes.locked_funds[0][0].toString());
  assert(lockRes.receiver == test1.key.accAddress);
  
  // try to unlock funds
  console.log('TRY TO UNLOCK FUNDS - expect error');
  await execute(
    test1,
    mirror.lock.unlockPositionFunds(positionIdx)
  ).catch((error) => {
    assert(error.response.data.error.includes('Nothing to unlock:'));
  });

  // mint more to lock more funds
  console.log('MINT MORE AAPL');
  let mintRes = await execute(
    test1,
    mirror.mint.mint(
      positionIdx,
      { 
        info: {token: { contract_addr: appleToken }},
        amount: int`100`.toString()
      },
      {
        short_params: {
          belief_price: undefined,
          max_spread: undefined
        }
      }
    )
  );

  // query again
  console.log('QUERY LOCK POSITION AGAIN - expect 2 locks');
  const lockRes2 = await mirror.lock.getPositionLockInfo(positionIdx);
  assert(lockRes2.locked_funds.length == 2);

  const mintAmount: number = parseInt(openRes['mint_amount'][0].substring(0, openRes['mint_amount'][0].indexOf('terra'))) + 100;
  
  // close position to trigger release funds
  console.log('BURNING AAPL')
  await execute(
    test1,
    mirror.mint.burn(
      positionIdx,
      {
        info: { token: { contract_addr: appleToken } },
        amount: mintAmount.toString()
      },
    )
  );
  console.log('WITHDRAWING ALL COLLATERAL')
  let withdrawRes = await execute(
    test1,
    mirror.mint.withdraw(
      positionIdx,
      {
        info: { native_token: { denom: 'uusd' } },
        amount: int`10000000`.toString()
      },
    )
  );
  assert(withdrawRes['action'][1] == 'unlock_shorting_funds');

  // query lock again
  console.log("QUERYING LOCK POSITION AGAIN - expect error")
  await mirror.lock.getPositionLockInfo(positionIdx)
    .catch((error) => {
      assert(error.response.data.error.includes('not found'));
    });
}
