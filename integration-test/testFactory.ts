import { assert } from 'console';
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

  console.log('Query asset mint config');
  const assetRes = await mirror.mint.getAssetConfig(newAsset);
  assert(assetRes.auction_discount == '0.3');
  assert(assetRes.min_collateral_ratio == '1.5');
  assert(assetRes.mint_end == undefined);
  assert(assetRes.min_collateral_ratio_after_migration == undefined);

  console.log('Revoke asset');
  await execute(
    test1,
    mirror.factory.revokeAsset(
      newAsset,
      '1.0'
    )
  );

  console.log('Query revoked asset mint config - exepect end price');
  const revokedAssetRes = await mirror.mint.getAssetConfig(newAsset);
  assert(revokedAssetRes.end_price == '1');

  console.log('Update config');
  await execute(
    test1,
    mirror.factory.updateConfig({
      owner: mirror.gov.key.accAddress
    })
  );

  console.log('Whitelist preIPO asset');
  const preIpoWhitelistLogs = await execute(
    test1,
    mirror.factory.whitelist('Test preIPO asset', 'TPREIPO', test1.key.accAddress, {
      auction_discount: '0.3',
      min_collateral_ratio: '100.0',
      weight: undefined,
      mint_period: 10,
      min_collateral_ratio_after_migration: '2.0',
    })
  );
  const preIpoAsset = preIpoWhitelistLogs['asset_token_addr'][0];

  console.log('Query preIPO asset mint config');
  const preIpoAssetRes = await mirror.mint.getAssetConfig(preIpoAsset);
  assert(preIpoAssetRes.auction_discount == '0.3');
  assert(preIpoAssetRes.min_collateral_ratio == '100');
  assert(preIpoAssetRes.mint_end != undefined);
  assert(preIpoAssetRes.min_collateral_ratio_after_migration == '2');

  console.log('Migrate preIPO asset');
  const migrationLogs = await execute(
    test1,
    mirror.factory.migrateAsset('Test postIPO asset', 'TPOSTIPO', preIpoAsset, '2.0')
  );
  const postIpoAsset = migrationLogs['asset_token_addr'][0];

  console.log('Query postIPO mint config');
  const postIpoAssetRes = await mirror.mint.getAssetConfig(postIpoAsset);
  assert(postIpoAssetRes.auction_discount == '0.3');
  assert(postIpoAssetRes.min_collateral_ratio == '2');
  assert(postIpoAssetRes.mint_end == undefined);
  assert(postIpoAssetRes.min_collateral_ratio_after_migration == undefined);

  console.log('Query migrated preIPO mint config');
  const preIpoMigratedAssetRes = await mirror.mint.getAssetConfig(preIpoAsset);
  assert(preIpoMigratedAssetRes.end_price == '2');
}
