import { Mirror } from '../src/client';
import { execute, terra } from './lib';

const { test1 } = terra.wallets;

export async function testFactory(mirror: Mirror) {

  console.log('WHITELIST TSLA');
  const whitelistLogs = await execute(
    test1,
    mirror.factory.whitelist('Tesla Derivative', 'TSLA', test1.key.accAddress, {
      auction_discount: '0.3',
      min_collateral_ratio: '1.5',
      weight: undefined,
      mint_period: undefined,
      min_collateral_ratio_after_migration: undefined,
    })
  );
  const tslaToken = whitelistLogs['asset_token_addr'][0];

  console.log('REVOKE TSLA');
  await execute(
    test1,
    mirror.factory.revokeAsset(
      tslaToken,
      '1.0'
    )
  );

  console.log('UPDATE CONFIG');
  await execute(
    test1,
    mirror.factory.updateConfig({
      owner: mirror.gov.key.accAddress
    })
  );
}
