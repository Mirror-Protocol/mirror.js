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
const { test1 } = terra.wallets;
  
export async function testCollateralOracle() {
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
      base_denom: UST.native_token.denom
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
      contract_addr: oracle,
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
  assert(collateralPriceRes.is_revoked === true);

  let new_oracle_price_query = {
    price: {
      base_asset: 'uusd',
      quote_asset: mirrorToken,
    }
  };
  let new_wasm_query = {
    smart: {
      contract_addr: oracle,
      msg: Buffer.from(JSON.stringify(new_oracle_price_query)).toString('base64'),
    }
  };
  let new_query_request = Buffer.from(JSON.stringify(new_wasm_query)).toString('base64');

  console.log('Update collateral query');
  await execute(
    test1,
    mirror.collaterallOracle.updateCollateralQuery(
      {native_token: { denom: "uluna" }},
      new_query_request
    )
  );

  let collateralInfoRes = await mirror.collaterallOracle.getCollateralAssetInfo(
    "uluna",
  );
  assert(collateralInfoRes.query_request === new_query_request);

  console.log('Update collateral premium');
  await execute(
    test1,
    mirror.collaterallOracle.updateCollateralPremium(
      {native_token: { denom: "uluna" }},
      100.0
    )
  );

  collateralInfoRes = await mirror.collaterallOracle.getCollateralAssetInfo(
    "uluna",
  );
  assert(collateralInfoRes.collateral_premium === '100.0');
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