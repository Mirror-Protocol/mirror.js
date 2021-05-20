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

  console.log('Update config');
  await execute(
    test1,
    mirror.collaterallOracle.updateConfig({
      factory_contract: test1.key.accAddress
    })
  );

  const configResponse = await mirror.collaterallOracle.getConfig();
  assert(configResponse.base_denom === UST.native_token.denom);

  const oracle_price_query = {
    price: {
      base_asset: appleToken,
      quote_asset: 'uusd'
    }
  };

  const wasm_query = {
    smart: {
      contract_addr: mirror.oracle.contractAddress,
      msg: Buffer.from(JSON.stringify(oracle_price_query)).toString('base64')
    }
  };

  const query_request = Buffer.from(JSON.stringify(wasm_query)).toString(
    'base64'
  );

  // generate random collateral denom to prevent error if we repeat the same test on the network
  const randomCollateralDenom: string = Math.random().toString(36).substring(7);
  console.log('Register collateral');
  await execute(
    test1,
    mirror.collaterallOracle.registerCollateralAsset(
      { native_token: { denom: randomCollateralDenom } },
      { terra_oracle: { terra_oracle_query: query_request } },
      50.0
    )
  );

  console.log('Query collateral price');
  const priceRes = await mirror.collaterallOracle.getCollateralPrice(randomCollateralDenom);
  assert(priceRes.rate === '1000');

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

  console.log('Update collateral premium');
  await execute(
    test1,
    mirror.collaterallOracle.updateCollateralPremium(
      { native_token: { denom: randomCollateralDenom } },
      100.0
    )
  );

  const collateralInfoRes = await mirror.collaterallOracle.getCollateralAssetInfo(
    randomCollateralDenom
  );
  assert(collateralInfoRes.collateral_premium === '100');

  console.log('Update config');
  await execute(
    test1,
    mirror.collaterallOracle.updateConfig({
      factory_contract: mirror.factory.key.accAddress
    })
  );

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
  const terraswap_pair_query = {
    pool: {}
  };
  const terraswap_wasm_query = {
    smart: {
      contract_addr: applePair,
      msg: Buffer.from(JSON.stringify(terraswap_pair_query)).toString('base64')
    }
  };
  const terraswap_query_request = Buffer.from(JSON.stringify(terraswap_wasm_query)).toString(
    'base64'
  );
  await execute(
    test1,
    mirror.collaterallOracle.updateCollateralPriceSource(
      { native_token: { denom: randomCollateralDenom } },
      { terraswap: { terraswap_query: terraswap_query_request } }
    )
  ); 

  console.log('Query collateral price');
  await mirror.collaterallOracle.getCollateralPrice(randomCollateralDenom).catch(console.log); // will fail if pool is empty
}
