import {
  isTxError,
  LocalTerra,
  MsgInstantiateContract,
  MsgStoreCode,
  AccAddress,
  StdFee,
  MsgExecuteContract
} from '@terra-money/terra.js';
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
  TerraswapPair
} from '../src/contracts';
import { UST } from '../src/utils/Asset';

const terra = new LocalTerra();
const { test1 } = terra.wallets;

const contractFiles: { [k: string]: string } = {
  mirror_collector: 'integration-test/artifacts/mirror_collector.wasm',
  mirror_factory: 'integration-test/artifacts/mirror_factory.wasm',
  mirror_gov: 'integration-test/artifacts/mirror_gov.wasm',
  mirror_mint: 'integration-test/artifacts/mirror_mint.wasm',
  mirror_oracle: 'integration-test/artifacts/mirror_oracle.wasm',
  mirror_staking: 'integration-test/artifacts/mirror_staking.wasm',
  terraswap_factory: 'integration-test/artifacts/terraswap_factory.wasm',
  terraswap_pair: 'integration-test/artifacts/terraswap_pair.wasm',
  terraswap_token: 'integration-test/artifacts/terraswap_token.wasm'
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
  mirrorToken: AccAddress;
  mirrorLpToken: AccAddress;
  mirrorPair: AccAddress;
  appleToken: AccAddress;
  applePair: AccAddress;
  appleLpToken: AccAddress;
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

  // Factory Instantiation
  const factory = await instantiate(createFactory());
  const mirrorToken = await instantiate(createMirrorToken(factory));
  const gov = await instantiate(createGov(mirrorToken));
  const oracle = await instantiate(createOracle(factory));
  const mint = await instantiate(createMint(factory, oracle));
  const staking = await instantiate(createStaking(factory, mirrorToken));
  const terraswapFactory = await instantiate(createTerraswapFactory());
  const collector = await instantiate(
    createCollector(gov, terraswapFactory, mirrorToken)
  );

  const mirror = new Mirror({
    factory,
    mirrorToken,
    gov,
    oracle,
    mint,
    staking,
    terraswapFactory,
    collector,
    key: test1.key
  });

  // Create MIR-UST pair
  console.log('CREATE TERRASWAP_PAIR for MIR-UST');
  const mirrorPairCreationLogs = await execute(
    mirror.terraswapFactory.createPair(factory, collector, '0.0025', '0.005', [
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
  mirror.assets.push({
    name: 'Mirror Token',
    symbol: 'MIR',
    token: new TerraswapToken({ contractAddress: mirrorToken, key: test1.key }),
    lpToken: new TerraswapToken({
      contractAddress: mirrorLpToken,
      key: test1.key
    }),
    pair: new TerraswapPair({
      contractAddress: mirrorPair,
      key: test1.key
    })
  });

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
      weight: '1.0',
      lp_commission: '0.0025',
      owner_commission: '0.005',
      auction_discount: '0.2',
      min_collateral_ratio: '1.5'
    })
  );

  const appleToken = whitelistAAPLLogs['asset_token_addr'][0];
  const applePair = whitelistAAPLLogs['pair_contract_addr'][0];
  const appleLpToken = whitelistAAPLLogs['liquidity_token_addr'][0];

  await execute(
    mirror.factory.updateConfig({
      owner: gov
    })
  );

  return {
    gov,
    factory,
    terraswapFactory,
    mirrorToken,
    staking,
    oracle,
    mint,
    collector,
    mirrorLpToken,
    mirrorPair,
    appleToken,
    applePair,
    appleLpToken
  };
}

const createFactory = () =>
  new MirrorFactory({ codeID: codeIDs['mirror_factory'], key: test1.key }).init(
    {
      mint_per_block: '10000000',
      token_code_id: codeIDs['terraswap_token'],
      base_denom: UST.native_token.denom
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
      initial_balances: [],
      mint: {
        minter: factory
      }
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
      proposal_deposit: '1000000'
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
      base_asset_info: UST
    },
    false
  );

const createMint = (factory: string, oracle: string) =>
  new MirrorMint({
    codeID: codeIDs['mirror_mint'],
    key: test1.key
  }).init(
    {
      owner: factory,
      oracle: oracle,
      base_asset_info: UST,
      token_code_id: codeIDs['terraswap_token']
    },
    false
  );

const createStaking = (factory: string, mirrorToken: string) =>
  new MirrorStaking({
    codeID: codeIDs['mirror_staking'],
    key: test1.key
  }).init(
    {
      owner: factory,
      mirror_token: mirrorToken
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
