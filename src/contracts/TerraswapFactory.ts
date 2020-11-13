import {
  AccAddress,
  MsgExecuteContract,
  Coins,
  MsgInstantiateContract,
  Numeric,
  Dec
} from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { AssetInfo } from '../utils/Asset';
import { ContractClient } from './ContractClient';

export namespace TerraswapFactory {
  export interface InitHook {
    msg: string;
    contract_addr: AccAddress;
  }

  export interface InitMsg {
    pair_code_id: number;
    token_code_id: number;
    init_hook?: InitHook;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      token_code_id?: number;
      pair_code_id?: number;
    };
  }

  export interface HandleCreatePair {
    create_pair: {
      asset_infos: [AssetInfo, AssetInfo];
      init_hook?: InitHook;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryPair {
    pair: {
      asset_infos: [AssetInfo, AssetInfo];
    };
  }

  export interface QueryPairs {
    pairs: {
      start_after?: [AssetInfo, AssetInfo];
      limit?: number;
    };
  }

  export interface ConfigResponse {
    owner: AccAddress;
    pair_code_id: number;
    token_code_id: number;
  }

  export interface PairResponse {
    asset_infos: [AssetInfo, AssetInfo];
    contract_addr: AccAddress;
    liquidity_token: AccAddress;
  }

  export interface PairsResponse {
    pairs: Array<PairResponse>;
  }

  export type HandleMsg = HandleUpdateConfig | HandleCreatePair;

  export type QueryMsg = QueryConfig | QueryPair | QueryPairs;
}

export class TerraswapFactory extends ContractClient {
  public init(
    init_msg: TerraswapFactory.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public updateConfig(
    config: TerraswapFactory.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public createPair(
    asset_infos: [AssetInfo, AssetInfo],
    init_hook?: TerraswapFactory.InitHook
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      create_pair: {
        asset_infos,
        init_hook
      }
    });
  }

  public async getConfig(): Promise<TerraswapFactory.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getPair(
    asset_infos: [AssetInfo, AssetInfo]
  ): Promise<TerraswapFactory.PairResponse> {
    return this.query({
      pair: { asset_infos }
    });
  }

  public async getPairs(
    start_after?: [AssetInfo, AssetInfo],
    limit?: number
  ): Promise<TerraswapFactory.PairsResponse> {
    return this.query({
      pairs: { start_after, limit }
    });
  }

  protected async query<T>(query_msg: TerraswapFactory.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    execute_msg: TerraswapFactory.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(execute_msg, coins);
  }
}
