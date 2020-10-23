import {
  AccAddress,
  Coins,
  MsgExecuteContract,
  MsgInstantiateContract
} from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { ContractClient } from './ContractClient';

export namespace MirrorCollector {
  export interface InitMsg {
    distribution_contract: AccAddress;
    terraswap_factory: AccAddress;
    mirror_token: AccAddress;
    base_denom: string;
  }

  export interface HandleConvert {
    convert: {
      asset_token: AccAddress;
    };
  }

  export interface HandleSend {
    send: EmptyObject;
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface ConfigResponse {
    distribution_contract: AccAddress;
    terraswap_factory: AccAddress;
    mirror_token: AccAddress;
    base_denom: string;
  }

  export type HandleMsg = HandleConvert | HandleSend;
  export type QueryMsg = QueryConfig;
}

export class MirrorCollector extends ContractClient {
  public init(
    init_msg: MirrorCollector.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public convert(asset_token: AccAddress): MsgExecuteContract {
    return this.createExecuteMsg({
      convert: {
        asset_token
      }
    });
  }

  public send(): MsgExecuteContract {
    return this.createExecuteMsg({
      send: {}
    });
  }

  public async getConfig(): Promise<MirrorCollector.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorCollector.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    executeMsg: MirrorCollector.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(executeMsg, coins);
  }
}
