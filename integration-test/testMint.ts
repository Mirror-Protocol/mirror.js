import { int } from '@terra-money/terra.js';
import { assert } from 'console';
import { Mirror } from '../src/client';
import { execute, terra } from './lib';

const { test1 } = terra.wallets;

export async function testMint(mirror: Mirror) {
  const appleToken = mirror.assets.mAPPL.token.contractAddress || '';
  const mirToken = mirror.assets.MIR.token.contractAddress || '';
  const mirPair = mirror.assets.MIR.pair.contractAddress || '';

  console.log('Query initial staking pool state');
  const initialPoolInfoRes = await mirror.staking.getPoolInfo(appleToken);
  const initialShortAmount = parseInt(initialPoolInfoRes.total_short_amount);

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

  // open a short position on mint contract
  console.log('Open short position on AAPL');
  const openRes = await execute(
    test1,
    mirror.mint.openPosition(
      {
        info: { native_token: { denom: 'uusd' } },
        amount: int`1000000`.toString()
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
  assert(openRes['is_short'][0] == 'true');
  assert(openRes['staker_addr'][0] == test1.key.accAddress);
  const returnAmount = parseInt(openRes['return_amount'][0]);
  const taxAmount = parseInt(openRes['tax_amount'][0]);
  const predLocked = returnAmount - taxAmount;

  assert(
    openRes['locked_amount'][0] == predLocked.toString() + 'uusd' ||
      openRes['locked_amount'][0] == (predLocked + 1).toString() + 'uusd'
  ); // rounding

  const mintAmount = parseInt(openRes['amount'][0]);
  const newShortAmount = initialShortAmount + mintAmount;

  console.log('Query staking pool info - check short increase');
  const poolInfoRes = await mirror.staking.getPoolInfo(appleToken);
  assert(poolInfoRes.total_short_amount == newShortAmount.toString());

  console.log('Burn on short position');
  await execute(
    test1,
    mirror.mint.burn(positionIdx, {
      info: { token: { contract_addr: appleToken } },
      amount: mintAmount.toString()
    })
  );

  console.log('Query staking pool info - check short decrease');
  const poolInfoRes2 = await mirror.staking.getPoolInfo(appleToken);
  assert(poolInfoRes2.total_short_amount == initialShortAmount.toString());

  try {
    await mirror.collaterallOracle.getCollateralAssetInfo(mirToken);
    console.info('MIR was already registered as collateral');
  } catch {
    console.log('Register MIR as collateral');
    const mir_terraswap_price_query = {
      pool: {}
    };
    const wasm_query = {
      smart: {
        contract_addr: mirPair,
        msg: Buffer.from(JSON.stringify(mir_terraswap_price_query)).toString(
          'base64'
        )
      }
    };
    const query_request = Buffer.from(JSON.stringify(wasm_query)).toString(
      'base64'
    );
    await execute(
      test1,
      mirror.collaterallOracle.registerCollateralAsset(
        { token: { contract_addr: mirToken } },
        query_request,
        0.5
      )
    );
  }

  console.log(
    'Open position with MIR as collateral -- expect error, under minCR due to collateral premium'
  );
  await execute(
    test1,
    mirror.mint.openPosition(
      {
        info: { token: { contract_addr: mirToken } },
        amount: int`1000000`.toString()
      },
      { token: { contract_addr: appleToken } },
      1.5
    )
  ).catch((error) => {
    assert(
      error.response.data.error.includes(
        'Can not open a position with low collateral ratio than minimum'
      )
    );
  });

  console.log('Open position with MIR as collateral - expect success');
  const mirOpenRes = await execute(
    test1,
    mirror.mint.openPosition(
      {
        info: { token: { contract_addr: mirToken } },
        amount: int`1000000`.toString()
      },
      { token: { contract_addr: appleToken } },
      2.0
    )
  );
  const mirPositionIdx = mirOpenRes['position_idx'][0];
  assert(mirOpenRes['collateral_amount'][0] == '1000000' + mirToken);
  assert(mirOpenRes['mint_amount'][0] == '500000' + appleToken);

  console.log('Query position');
  await mirror.mint.getPosition(mirPositionIdx);

  console.log('Get next position idx');
  await mirror.mint.getNextPositionIdx();
}
