import { Mirror } from '../src/client';
import { strict as assert } from 'assert';
import { UST } from '../src/utils/Asset';
import { execute, terra } from './lib';

const { test1 } = terra.wallets;

export async function testCollateralOracle(mirror: Mirror) {
  const appleToken = mirror.assets['mAPPL'].token.contractAddress || '';
  const applePair = mirror.assets['mAPPL'].pair.contractAddress || '';

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

  const configResponse = await mirror.collaterallOracle.getConfig();
  assert(configResponse.base_denom === UST.native_token.denom);

  // generate random collateral denom to prevent error if we repeat the same test on the network
  const randomCollateralDenom: string = Math.random().toString(36).substring(7);
  console.log('Register collateral');
  await execute(
    test1,
    mirror.collaterallOracle.registerCollateralAsset(
      { native_token: { denom: randomCollateralDenom } },
      { native: { native_denom: "uluna"} },
      2.0
    )
  );

  console.log('Revoke collateral');
  await execute(
    test1,
    mirror.collaterallOracle.revokeCollateralAsset({
      native_token: { denom: randomCollateralDenom }
    })
  );

  const collateralPriceRes = await mirror.collaterallOracle.getCollateralPrice(
    randomCollateralDenom
  );
  assert(collateralPriceRes.is_revoked == true);

  console.log('Update collateral multiplier');
  await execute(
    test1,
    mirror.collaterallOracle.updateCollateralMultiplier(
      { native_token: { denom: randomCollateralDenom } },
      1.0
    )
  );

  const collateralInfoRes = await mirror.collaterallOracle.getCollateralAssetInfo(
    randomCollateralDenom
  );
  assert(collateralInfoRes.multiplier === '1');

  console.log('Update price source to fixed');
  await execute(
    test1,
    mirror.collaterallOracle.updateCollateralPriceSource(
      { native_token: { denom: randomCollateralDenom } },
      { fixed_price: { price: '123.1' } }
    )
  );

  console.log('Query collateral price');
  const priceRes2 = await mirror.collaterallOracle.getCollateralPrice(randomCollateralDenom);
  assert(priceRes2.rate == '123.1');

  console.log('Update price source to terraswap');
  await execute(
    test1,
    mirror.collaterallOracle.updateCollateralPriceSource(
      { native_token: { denom: randomCollateralDenom } },
      { terraswap: { terraswap_pair_addr: applePair } }
    )
  ); 

  console.log('Query collateral price');
  await mirror.collaterallOracle.getCollateralPrice(randomCollateralDenom).catch(console.log); // will fail if pool is empty
}
