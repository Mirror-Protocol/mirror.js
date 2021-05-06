import { Mirror } from '../src/client';
import { strict as assert } from 'assert';
import { UST } from '../src/utils/Asset';
import { execute,terra } from './lib';

const { test1 } = terra.wallets;
  
export async function testCollateralOracle(mirror: Mirror) {

  const appleToken = mirror.assets['mAPPL'].token.contractAddress || "";

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
  )

  console.log('Update config');
  await execute(
    test1,
    mirror.collaterallOracle.updateConfig({
      factory_contract: test1.key.accAddress
    })
  );

  let configResponse = await mirror.collaterallOracle.getConfig();
  assert(configResponse.base_denom === UST.native_token.denom);

  let oracle_price_query = {
    price: {
      base_asset: 'uusd',
      quote_asset: appleToken,
    }
  };

  let wasm_query = {
    smart: {
      contract_addr: mirror.oracle.contractAddress,
      msg: Buffer.from(JSON.stringify(oracle_price_query)).toString('base64'),
    }
  };

  let query_request = Buffer.from(JSON.stringify(wasm_query)).toString('base64');

  console.log('Register collateral');
  await execute(
    test1,
    mirror.collaterallOracle.registerCollateralAsset(
      {native_token: { denom: "uluna" }},
      query_request,
      50.0,
    )
  );

  console.log('Revoke collateral');
  await execute(
    test1,
    mirror.collaterallOracle.revokeCollateralAsset(
      {native_token: { denom: "uluna" }},
    )
  );

  let collateralPriceRes = await mirror.collaterallOracle.getCollateralPrice(
    "uluna",
  );
  assert(collateralPriceRes.is_revoked == true);

  console.log('Update collateral premium');
  await execute(
    test1,
    mirror.collaterallOracle.updateCollateralPremium(
      {native_token: { denom: "uluna" }},
      100.0
    )
  );

  let collateralInfoRes = await mirror.collaterallOracle.getCollateralAssetInfo(
    "uluna",
  );
  assert(collateralInfoRes.collateral_premium === '100');

  console.log('Update config');
  await execute(
    test1,
    mirror.collaterallOracle.updateConfig({
      factory_contract: mirror.factory.key.accAddress
    })
  );
}