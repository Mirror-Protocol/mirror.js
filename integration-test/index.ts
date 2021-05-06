import {
  LocalTerra,
} from '@terra-money/terra.js';
import * as fs from 'fs';
import { testUserFlow } from "./testUserFlow";
import { testCollateralOracle } from "./testCollateralOracle";
import { testFactory } from "./testFactory";
import { testLock } from "./testLock";
import { testGov } from "./testGov";
import { deployContracts } from "./deploy";
import { Mirror } from '../src/client';
import { contractAddressesFile } from './lib';

const terra = new LocalTerra();
const { test1, test2 } = terra.wallets;

async function main() {
  console.log('--- DEPLOY CONTRACTS ---')
  const {
    mirror,
    mirror2
  } = await setup(true);

  console.log('--- TEST USER FLOW ---')
  await testUserFlow(mirror, mirror2);
  console.log('--- TEST FACTORY ---')
  await testFactory(mirror);
  console.log('--- TEST COLLATERAL ORACLE ---')
  await testCollateralOracle(mirror);
  console.log('--- TEST LOCK ---')
  await testLock(mirror);
  console.log('--- TEST GOV ---')
  await testGov(mirror);
}

async function setup(deploy: boolean): Promise<{
  mirror: Mirror;
  mirror2: Mirror;
}> {
  const {
    gov,
    factory,
    terraswapFactory,
    staking,
    oracle,
    mint,
    collector,
    community,
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