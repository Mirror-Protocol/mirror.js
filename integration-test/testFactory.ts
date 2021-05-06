import { Mirror } from '../src/client';
import { execute, terra } from './lib';

const { test1 } = terra.wallets;

export async function testFactory(mirror: Mirror) {

  console.log('Whitelist new asset');
  const whitelistLogs = await execute(
    test1,
    mirror.factory.whitelist('Test asset', 'TASSET', test1.key.accAddress, {
      auction_discount: '0.3',
      min_collateral_ratio: '1.5',
      weight: undefined,
      mint_period: undefined,
      min_collateral_ratio_after_migration: undefined,
    })
  );
  const newAsset = whitelistLogs['asset_token_addr'][0];

  console.log('Revoke asset');
  await execute(
    test1,
    mirror.factory.revokeAsset(
      newAsset,
      '1.0'
    )
  );

  console.log('Update config');
  await execute(
    test1,
    mirror.factory.updateConfig({
      owner: mirror.gov.key.accAddress
    })
  );
}
