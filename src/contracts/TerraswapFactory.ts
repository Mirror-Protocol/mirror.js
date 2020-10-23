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
import ContractClient from './ContractClient';

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
      pair_owner: AccAddress;
      commission_collector: AccAddress;
      lp_commission: string;
      owner_commission: string;
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

  export interface ConfigResponse {
    owner: AccAddress;
    pair_code_id: number;
    token_code_id: number;
  }

  export interface PairResponse {
    owner: AccAddress;
    contract_addr: AccAddress;
    asset_infos: [AssetInfo, AssetInfo];
  }

  export type HandleMsg = HandleUpdateConfig | HandleCreatePair;

  export type QueryMsg = QueryConfig | QueryPair;
}

export default class TerraswapFactory extends ContractClient {
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
    pair_owner: AccAddress,
    commission_collector: AccAddress,
    lp_commission: Numeric.Input,
    owner_commission: Numeric.Input,
    asset_infos: [AssetInfo, AssetInfo],
    init_hook?: TerraswapFactory.InitHook
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      create_pair: {
        pair_owner,
        commission_collector,
        lp_commission: new Dec(lp_commission).toString(),
        owner_commission: new Dec(owner_commission).toString(),
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
