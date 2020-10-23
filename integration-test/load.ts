import {
  BlockTxBroadcastResult,
  Coins,
  isTxError,
  LocalTerra,
  MsgExecuteContract,
  MsgInstantiateContract,
  MsgStoreCode,
  StdFee,
  TxSuccess,
} from '@terra-money/terra.js';
import * as fs from 'fs';

const terra = new LocalTerra();
const { test1 } = terra.wallets;

const contracts: { [key: string]: any } = {
  mirror_collector: {
    codeId: 91,
  },
  mirror_factory: {
    codeId: 92,
  },
  mirror_gov: {
    codeId: 93,
  },
  mirror_mint: {
    codeId: 94,
  },
  mirror_oracle: {
    codeId: 95,
  },
  mirror_staking: {
    codeId: 96,
  },
  terraswap_factory: {
    codeId: 97,
  },
  terraswap_pair: {
    codeId: 98,
  },
  terraswap_token: {
    codeId: 99,
  },
};

async function uploadContracts(): Promise<void> {
  for (const contract of Object.keys(contracts)) {
    const bytecode = fs
      .readFileSync(`./artifacts/${contract}.wasm`)
      .toString('base64');

    const storeCode = new MsgStoreCode(test1.key.accAddress, bytecode);
    const tx = await test1.createAndSignTx({
      msgs: [storeCode],
    });
    const result = await terra.tx.broadcast(tx);

    if (isTxError(result)) {
      throw new Error(`Error: ${result.code} - ${result.codespace}`);
    }

    const codeId = result.logs[0].eventsByType.store_code.code_id[0];
    contracts[contract]['codeId'] = +codeId;
    console.log(`Uploaded contract ${contract} with codeId ${codeId}`);
  }
}

const init = (contract: string, initMsg: object) =>
  new MsgInstantiateContract(
    test1.key.accAddress,
    contracts[contract].codeId,
    initMsg
  );

const createFactory = () =>
  init('mirror_factory', {
    mint_per_block: '10000000',
    token_code_id: contracts['terraswap_token'].codeId,
    base_denom: 'uusd',
  });

const createMirrorToken = (factory: string) =>
  init('terraswap_token', {
    name: 'Mirror Token',
    symbol: 'MIRROR',
    decimals: 6,
    initial_balances: [],
    mint: {
      minter: factory,
    },
  });

const createGov = (mirrorToken: string) =>
  init('mirror_gov', {
    mirror_token: mirrorToken,
    quorum: '0.34',
    threshold: '0.5',
    voting_period: 1000,
    effective_delay: 1000,
    proposal_deposit: '1000000',
  });

const createOracle = (factory: string) =>
  init('mirror_oracle', {
    owner: factory,
    base_asset_info: {
      native_token: {
        denom: 'uusd',
      },
    },
  });

const createMint = (factory: string, oracle: string) =>
  init('mirror_mint', {
    owner: factory,
    oracle: oracle,
    base_asset_info: {
      native_token: {
        denom: 'uusd',
      },
    },
    token_code_id: contracts['terraswap_token'].codeId,
  });

const createStaking = (factory: string, mirrorToken: string) =>
  init('mirror_staking', {
    owner: factory,
    mirror_token: mirrorToken,
  });

const createTerraswapFactory = init('terraswap_factory', {
  pair_code_id: contracts['terraswap_pair'].codeId,
  token_code_id: contracts['terraswap_token'].codeId,
});

const createCollector = (
  gov: string,
  terraswapFactory: string,
  mirrorToken: string
) =>
  init('mirror_collector', {
    distribution_contract: gov,
    terraswap_factory: terraswapFactory,
    mirror_token: mirrorToken,
    base_denom: 'uusd',
  });

async function instantiate(msg: MsgInstantiateContract): Promise<string> {
  const tx = await test1.createAndSignTx({
    msgs: [msg],
    fee: new StdFee(500000, { uluna: 1_000_000_000 }),
  });

  const result = await terra.tx.broadcast(tx);

  if (isTxError(result)) {
    throw new Error(
      `Error while instantiating: ${result.code} - ${result.raw_log}`
    );
  }
  console.log(result.logs[0].eventsByType);
  const contractAddress =
    result.logs[0].eventsByType.instantiate_contract.contract_address[0];
  return contractAddress;
}

async function execute(
  contractAddress: string,
  executeMsg: object,
  init_coins: Coins.Input = {}
): Promise<BlockTxBroadcastResult & TxSuccess> {
  const tx = await test1.createAndSignTx({
    msgs: [
      new MsgExecuteContract(
        test1.key.accAddress,
        contractAddress,
        executeMsg,
        init_coins
      ),
    ],
    fee: new StdFee(1000000, { uluna: 1000000000 }),
  });
  const result = await terra.tx.broadcast(tx);
  if (isTxError(result)) {
    throw new Error(`Error in executing: ${result.code} ${result.raw_log}`);
  }
  return result;
}

async function main(): Promise<void> {
  // await uploadContracts();
  const factory = await instantiate(createFactory());
  const mirrorToken = await instantiate(createMirrorToken(factory));
  const gov = await instantiate(createGov(mirrorToken));
  const oracle = await instantiate(createOracle(factory));
  const mint = await instantiate(createMint(factory, oracle));
  const staking = await instantiate(createStaking(factory, mirrorToken));
  const terraswapFactory = await instantiate(createTerraswapFactory);
  const collector = await instantiate(
    createCollector(gov, terraswapFactory, mirrorToken)
  );

  console.log('terraswapFactory.create_pair');

  await execute(terraswapFactory, {
    create_pair: {
      pair_owner: gov,
      commission_collector: collector,
      lp_commission: '0.0025',
      owner_commission: '0.0005',
      asset_infos: [
        { native_token: { denom: 'uusd' } },
        { token: { contract_addr: mirrorToken } },
      ],
    },
  });

  console.log('factory.postInitialize');
  await execute(factory, {
    post_initialize: {
      owner: test1.key.accAddress,
      terraswap_factory: terraswapFactory,
      mirror_token: mirrorToken,
      staking_contract: staking,
      oracle_contract: oracle,
      mint_contract: mint,
      commission_collector: collector,
    },
  });

  console.log('factory.terraswapCreationHook');
  await execute(factory, {
    terraswap_creation_hook: {
      asset_token: mirrorToken,
    },
  });

  console.log('factory.whitelist(AAPL)');
  const whitelistAAPLResult = await execute(factory, {
    whitelist: {
      name: 'apple derivative',
      symbol: 'AAPL',
      oracle_feeder: test1.key.accAddress,
      params: {
        weight: '1.0',
        lp_commission: '0.0025',
        owner_commission: '0.0005',
        auction_discount: '0.2',
        min_collateral_ratio: '1.5',
      },
    },
  });

  const mAAPL =
    whitelistAAPLResult.logs[0].eventsByType.from_contract.asset_token_addr[0];

  const pair =
    whitelistAAPLResult.logs[0].eventsByType.from_contract.pair_token_addr[0];

  const liquidity =
    whitelistAAPLResult.logs[0].eventsByType.from_contract
      .liquidity_token_addr[0];

  console.log('factory.update_config({owner: gov})');
  await execute(factory, {
    update_config: {
      owner: gov,
    },
  });

  // MINT process
  console.log('oracle.feed_price');
  await execute(oracle, {
    feed_price: {
      price_infos: {
        asset_token: mAAPL,
        price: '1000.0',
      },
    },
  });

  // Open position
  console.log('mint.open_position');
  await execute(mint, {
    open_position: {
      collateral: {
        info: {
          native_token: {
            denom: 'uusd',
          },
        },
        amount: '10000000000',
      },
      asset_info: {
        token: {
          contract_address: mAAPL,
        },
      },
    },
  });

  // Deposit UST
  await execute(
    mint,
    {
      deposit: {
        collateral: {
          info: {
            native_token: {
              denom: 'uusd',
            },
          },
          amount: '10000000000',
        },
        position_idx: '1',
      },
    },
    '10000000000uusd'
  );

  // Mint Asset
  await execute(mint, {
    mint: {
      asset: {
        info: {
          token: {
            contract_addr: mAAPL,
          },
        },
        amount: '6666666',
      },
      position_idx: '1',
    },
  });

  // Provide liquidity to pair
  await execute(mAAPL, {
    increase_allowance: {
      spender: pair,
      amount: '6000000',
    },
  });
}

main();
