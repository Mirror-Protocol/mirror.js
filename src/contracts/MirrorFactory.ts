import {
  AccAddress,
  BlockTxBroadcastResult,
  Coins,
  Dec,
  Numeric,
} from '@terra-money/terra.js';
import { EmptyObject } from '../utilTypes';
import { ContractClient } from './ContractClient';

export namespace MirrorFactory {
  export interface Params {
    weight: string;
    lp_commission: string;
    owner_commission: string;
    auction_discount: string;
    min_collateral_ratio: string;
  }

  export interface PostInitialize {
    post_initialize: {
      owner: AccAddress;
      terraswap_factory: AccAddress;
      mirror_token: AccAddress;
      staking_contract: AccAddress;
      oracle_contract: AccAddress;
      mint_contract: AccAddress;
      commission_collector: AccAddress;
    };
  }

  export interface UpdateWeight {
    update_weight: {
      asset_token: AccAddress;
      weight: string;
    };
  }

  export interface UpdateConfig {
    update_config: {
      owner?: AccAddress;
      mint_per_block?: string;
      token_code_id?: number;
    };
  }

  export interface Whitelist {
    whitelist: {
      name: string;
      symbol: string;
      oracle_feeder: AccAddress;
      params: Params;
    };
  }

  export interface TokenCreationHook {
    token_creation_hook: {
      oracle_feeder: AccAddress;
    };
  }

  export interface TerraswapCreationHook {
    terraswap_creation_hook: {
      asset_token: AccAddress;
    };
  }

  export interface PassCommand {
    pass_command: {
      contract_addr: AccAddress;
      msg: string;
    };
  }
  export interface Mint {
    mint: {
      asset_token: AccAddress;
    };
  }

  export interface Config {
    config: EmptyObject;
  }

  export interface DistributionInfo {
    distribution_info: { asset_token: AccAddress };
  }

  export type ConfigResponse = PostInitialize['post_initialize'] &
    Required<UpdateConfig['update_config']>;

  export interface DistributionInfoResponse {
    weight: string;
    last_height: number;
  }

  export type HandleMsg =
    | PostInitialize
    | UpdateWeight
    | UpdateConfig
    | Whitelist
    | TokenCreationHook
    | TerraswapCreationHook
    | PassCommand
    | Mint;

  export type QueryMsg = Config | DistributionInfo;
}

export class MirrorFactory extends ContractClient {
  public async postInitialize(
    owner: AccAddress,
    terraswap_factory: AccAddress,
    mirror_token: AccAddress,
    staking_contract: AccAddress,
    oracle_contract: AccAddress,
    mint_contract: AccAddress,
    commission_collector: AccAddress
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      post_initialize: {
        owner,
        terraswap_factory,
        mirror_token,
        staking_contract,
        oracle_contract,
        mint_contract,
        commission_collector,
      },
    });
  }

  public async updateWeight(
    asset_token: AccAddress,
    weight: Dec
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      update_weight: {
        asset_token,
        weight: weight.toFixed(),
      },
    });
  }

  public async updateConfig(
    config: MirrorFactory.UpdateConfig['update_config']
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      update_config: config,
    });
  }

  public async whitelist(
    name: string,
    symbol: string,
    oracle_feeder: AccAddress,
    params: {
      weight: Numeric.Input;
      lp_commission: Numeric.Input;
      owner_commission: Numeric.Input;
      auction_discount: Numeric.Input;
      min_collateral_ratio: Numeric.Input;
    }
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      whitelist: {
        name,
        symbol,
        oracle_feeder,
        params: {
          weight: new Dec(params.weight).toFixed(),
          lp_commission: new Dec(params.lp_commission).toFixed(),
          owner_commission: new Dec(params.owner_commission).toFixed(),
          auction_discount: new Dec(params.auction_discount).toFixed(),
          min_collateral_ratio: new Dec(params.min_collateral_ratio).toFixed(),
        },
      },
    });
  }

  public async tokenCreationHook(
    oracle_feeder: AccAddress
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      token_creation_hook: {
        oracle_feeder,
      },
    });
  }

  public async terraswapCreationHook(
    asset_token: AccAddress
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      terraswap_creation_hook: {
        asset_token,
      },
    });
  }

  public async passCommand(
    contract_addr: AccAddress,
    msg: any
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      pass_command: {
        contract_addr,
        msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
      },
    });
  }

  public async mint(asset_token: AccAddress): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      mint: {
        asset_token,
      },
    });
  }

  public async getConfig(): Promise<MirrorFactory.ConfigResponse> {
    return this.query({
      config: {},
    });
  }

  public async getDistributionInfo(
    asset_token: AccAddress
  ): Promise<MirrorFactory.DistributionInfoResponse> {
    return this.query({
      distribution_info: { asset_token },
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorFactory.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected async broadcastExecute(
    execute_msg: MirrorFactory.HandleMsg,
    coins: Coins.Input = {}
  ): Promise<BlockTxBroadcastResult> {
    return super.broadcastExecute(execute_msg, coins);
  }
}
