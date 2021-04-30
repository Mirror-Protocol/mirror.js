import {
  isTxError,
  LocalTerra,
  MsgInstantiateContract,
  MsgStoreCode,
  AccAddress,
  StdFee,
  MsgExecuteContract
} from '@terra-money/terra.js';
import {contractAddressesFile} from './lib';
import * as fs from 'fs';
import { Mirror } from '../src/client/Mirror';
import {
  MirrorFactory,
  MirrorGov,
  MirrorOracle,
  MirrorCollector,
  MirrorMint,
  MirrorStaking,
  TerraswapToken,
  TerraswapFactory,
  TerraswapPair,
  MirrorCollateralOracle
} from '../src/contracts';
import { UST } from '../src/utils/Asset';
import { MirrorCommunity } from '../src/contracts/MirrorCommunity';

const terra = new LocalTerra();
const { test1 } = terra.wallets;

const contractFiles: { [k: string]: string } = {
  mirror_collector: 'integration-test/artifacts/mirror_collector.wasm',
  mirror_community: 'integration-test/artifacts/mirror_community.wasm',
  mirror_factory: 'integration-test/artifacts/mirror_factory.wasm',
  mirror_gov: 'integration-test/artifacts/mirror_gov.wasm',
  mirror_mint: 'integration-test/artifacts/mirror_mint.wasm',
  mirror_oracle: 'integration-test/artifacts/mirror_oracle.wasm',
  mirror_staking: 'integration-test/artifacts/mirror_staking.wasm',
  terraswap_factory: 'integration-test/artifacts/terraswap_factory.wasm',
  terraswap_pair: 'integration-test/artifacts/terraswap_pair.wasm',
  terraswap_token: 'integration-test/artifacts/terraswap_token.wasm',
  mirror_collateral_oracle: 'integration-test/artifacts/mirror_collateral_oracle.wasm',
};

const codeIDs: {
  [k: string]: number;
} = {};

export async function deployContracts(): Promise<{
  gov: AccAddress;
  factory: AccAddress;
  terraswapFactory: AccAddress;
  staking: AccAddress;
  oracle: AccAddress;
  mint: AccAddress;
  collector: AccAddress;
  community: AccAddress;
  mirrorToken: AccAddress;
  mirrorLpToken: AccAddress;
  mirrorPair: AccAddress;
  appleToken: AccAddress;
  applePair: AccAddress;
  appleLpToken: AccAddress;
  collateralOracle: AccAddress;
}> {
  // upload all contracts
  for (const contract in contractFiles) {
    const storeCode = new MsgStoreCode(
      test1.key.accAddress,
      fs.readFileSync(contractFiles[contract]).toString('base64')
    );

    const storeCodeTx = await test1.createAndSignTx({
      msgs: [storeCode]
    });

    const storeCodeTxResult = await terra.tx.broadcast(storeCodeTx);

    if (isTxError(storeCodeTxResult)) {
      throw new Error(`couldn't store code for ${contract}`);
    }

    const codeId = +storeCodeTxResult.logs[0].eventsByType.store_code
      .code_id[0];

    codeIDs[contract] = codeId;

    console.log(`Uploaded ${contract} - code id: ${codeId}`);
  }

  // instanciate all contracts
  const factory = await instantiate(createFactory());
  const mirrorToken = await instantiate(createMirrorToken(factory));
  const gov = await instantiate(createGov(mirrorToken));
  const oracle = await instantiate(createOracle(factory));
  const terraswapFactory = await instantiate(createTerraswapFactory());
  const collector = await instantiate(
    createCollector(gov, terraswapFactory, mirrorToken)
  );
  const mint = await instantiate(createMint(factory, oracle, collector));
  const staking = await instantiate(createStaking(factory, mirrorToken, mint, oracle, terraswapFactory));
  const community = await instantiate(createCommunity(gov, mirrorToken));
  const collateralOracle = await instantiate(createCollateralOracle(mint, factory));

  const mirror = new Mirror({
    factory,
    mirrorToken,
    gov,
    oracle,
    collateralOracle,
    mint,
    staking,
    terraswapFactory,
    collector,
    key: test1.key
  });

  // Create MIR-UST pair
  console.log('CREATE TERRASWAP_PAIR for MIR-UST');
  const mirrorPairCreationLogs = await execute(
    mirror.terraswapFactory.createPair([
      UST,
      {
        token: {
          contract_addr: mirrorToken
        }
      }
    ])
  );

  // Register MIR LP Token & MIR-UST pair contract
  const mirrorLpToken = mirrorPairCreationLogs.liquidity_token_addr[0];
  const mirrorPair = mirrorPairCreationLogs.pair_contract_addr[0];
  mirror.assets['MIR'] = {
    name: 'Mirror Token',
    symbol: 'MIR',
    token: new TerraswapToken({
      contractAddress: mirrorToken,
      key: test1.key
    }),
    lpToken: new TerraswapToken({
      contractAddress: mirrorLpToken,
      key: test1.key
    }),
    pair: new TerraswapPair({
      contractAddress: mirrorPair,
      key: test1.key
    })
  };

  // PostInitailize factory
  console.log('POST_INITIALZE FACTORY');
  await execute(
    mirror.factory.postInitialize(
      test1.key.accAddress,
      terraswapFactory,
      mirrorToken,
      staking,
      oracle,
      mint,
      collector
    )
  );

  // Whitelist MIR
  console.log('WHITELIST MIRROR');
  await execute(mirror.factory.terraswapCreationHook(mirrorToken));

  console.log('WHITELIST AAPL');
  const whitelistAAPLLogs = await execute(
    mirror.factory.whitelist('APPLE Derivative', 'AAPL', test1.key.accAddress, {
      auction_discount: '0.2',
      min_collateral_ratio: '1.5',
      weight: undefined,
      mint_period: undefined,
      min_collateral_ratio_after_migration: undefined,
    })
  );

  const appleToken = whitelistAAPLLogs['asset_token_addr'][0];
  const applePair = whitelistAAPLLogs['pair_contract_addr'][0];
  const appleLpToken = whitelistAAPLLogs['liquidity_token_addr'][0];

  const res = {
    gov,
    factory,
    terraswapFactory,
    mirrorToken,
    staking,
    oracle,
    mint,
    collector,
    community,
    mirrorLpToken,
    mirrorPair,
    appleToken,
    applePair,
    appleLpToken,
    collateralOracle,
  };

  fs.writeFileSync(contractAddressesFile, JSON.stringify(res));

  return res;
}

const createFactory = () =>
  new MirrorFactory({ codeID: codeIDs['mirror_factory'], key: test1.key }).init(
    {
      token_code_id: codeIDs['terraswap_token'],
      base_denom: UST.native_token.denom,
      distribution_schedule: [
        [0, 10, '10000000000'],
        [10, 20, '20000000000'],
        [20, 300, '30000000000']
      ]
    },
    false
  );

const createMirrorToken = (factory: string) =>
  new TerraswapToken({
    codeID: codeIDs['terraswap_token'],
    key: test1.key
  }).init(
    {
      name: 'Mirror Token',
      symbol: 'MIR',
      decimals: 6,
      initial_balances: [{ address: factory, amount: '60000000000' }]
    },
    false
  );

const createGov = (mirrorToken: string) =>
  new MirrorGov({
    codeID: codeIDs['mirror_gov'],
    key: test1.key
  }).init(
    {
      mirror_token: mirrorToken,
      quorum: '0.34',
      threshold: '0.5',
      voting_period: 1000,
      effective_delay: 1000,
      expiration_period: 2000,
      proposal_deposit: '1000000'
    },
    false
  );

const createCommunity = (gov: string, mirrorToken: string) =>
  new MirrorCommunity({
    codeID: codeIDs['mirror_community'],
    key: test1.key
  }).init(
    {
      owner: gov,
      mirror_token: mirrorToken,
      spend_limit: '10000000000'
    },
    false
  );

const createOracle = (factory: string) =>
  new MirrorOracle({
    codeID: codeIDs['mirror_oracle'],
    key: test1.key
  }).init(
    {
      owner: factory,
      base_asset: UST.native_token.denom
    },
    false
  );

const createMint = (factory: string, oracle: string, collector: string) =>
  new MirrorMint({
    codeID: codeIDs['mirror_mint'],
    key: test1.key
  }).init(
    {
      owner: factory,
      oracle: oracle,
      collector: collector,
      base_denom: UST.native_token.denom,
      token_code_id: codeIDs['terraswap_token'],
      protocol_fee_rate: '0.015'
    },
    false
  );

const createStaking = (factory: string, mirrorToken: string, mint: string, oracle: string, terraswapFactory: string) =>
  new MirrorStaking({
    codeID: codeIDs['mirror_staking'],
    key: test1.key
  }).init(
    {
      owner: factory,
      mirror_token: mirrorToken,
      mint_contract: mint,
      oracle_contract: oracle,
      terraswap_factory: terraswapFactory,
      base_denom: UST.native_token.denom,
      premium_tolerance: "2.0",
      short_reward_weight: "20.0",
      premium_short_reward_weight: "40.0"
    },
    false
  );

const createTerraswapFactory = () =>
  new TerraswapFactory({
    codeID: codeIDs['terraswap_factory'],
    key: test1.key
  }).init(
    {
      pair_code_id: codeIDs['terraswap_pair'],
      token_code_id: codeIDs['terraswap_token']
    },
    false
  );

const createCollector = (
  gov: string,
  terraswapFactory: string,
  mirrorToken: string
) =>
  new MirrorCollector({
    codeID: codeIDs['mirror_collector'],
    key: test1.key
  }).init(
    {
      distribution_contract: gov,
      terraswap_factory: terraswapFactory,
      mirror_token: mirrorToken,
      base_denom: UST.native_token.denom
    },
    false
  );

const createCollateralOracle = (
  mint: string,
  mirrorFactory: string
) => 
  new MirrorCollateralOracle({
    codeID: codeIDs['mirror_collateral_oracle'],
    key: test1.key
  }).init(
    {
      owner: test1.key.accAddress,
      mint_contract: mint,
      factory_contract: mirrorFactory,
      base_denom: UST.native_token.denom
    },
    false
  );

async function instantiate(msg: MsgInstantiateContract): Promise<string> {
  const tx = await test1.createAndSignTx({
    msgs: [msg],
    fee: new StdFee(500000, { uluna: 1_000_000 })
  });

  const result = await terra.tx.broadcast(tx);

  if (isTxError(result)) {
    throw new Error(
      `Error while instantiating: ${result.code} - ${result.raw_log}`
    );
  }

  const contractAddress =
    result.logs[0].eventsByType.instantiate_contract.contract_address[0];

  return contractAddress;
}

async function execute(
  msg: MsgExecuteContract
): Promise<{
  [key: string]: string[];
}> {
  const tx = await test1.createAndSignTx({
    msgs: [msg],
    fee: new StdFee(1000000, { uluna: 1_000_000 })
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
