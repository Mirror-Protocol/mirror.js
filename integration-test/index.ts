import {
  LocalTerra,
} from '@terra-money/terra.js';
import * as fs from 'fs';
import { testUserFlow } from "./testUserFlow";
import { testCollateralOracle } from "./testCollateralOracle";
import { testFactory } from "./testFactory";
import { testLock } from "./testLock";
import { deployContracts } from "./deploy";
import { Mirror } from '../src/client';
import { contractAddressesFile } from './lib';

const terra = new LocalTerra();
const { test1, test2 } = terra.wallets;

async function main() {
  const {
    mirror,
    mirror2
  } = await setup(true);

  await testUserFlow(mirror, mirror2);
  await testFactory(mirror);
  await testCollateralOracle(mirror);
  await testLock(mirror);
}

async function setup(deploy: boolean): Promise<{
  mirror: Mirror;
  mirror2: Mirror;
}> {
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
    collateralOracle,
    lock
  } = deploy? 
    await deployContracts() :
    JSON.parse(fs.readFileSync(contractAddressesFile).toString());

  const mirror = new Mirror({
    lcd: terra,
    key: test1.key,
    collector,
    community,
    factory,
    gov,
    mint,
    staking,
    lock,
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

  const mirror2 = new Mirror({
    lcd: terra,
    key: test2.key,
    collector,
    community,
    factory,
    gov,
    mint,
    staking,
    lock,
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

  return {mirror, mirror2};
}

main();