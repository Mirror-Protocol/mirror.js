import {
  AccAddress,
  Coins,
  MsgExecuteContract,
  MsgInstantiateContract,
  Numeric,
  Int
} from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { ContractClient } from './ContractClient';

export namespace MirrorCommunity {
  export interface InitMsg {
    owner: AccAddress;
    mirror_token: AccAddress;
    spend_limit: string;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      spend_limit?: string;
    };
  }

  export interface HandleSpend {
    spend: {
      recipient: AccAddress;
      amount: string;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mirror_token: AccAddress;
    spend_limit: string;
  }

  export type HandleMsg = HandleUpdateConfig | HandleSpend;
  export type QueryMsg = QueryConfig;
}

export class MirrorCommunity extends ContractClient {
  public init(init_msg: MirrorCommunity.InitMsg): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {});
  }

  public updateConfig(
    config: MirrorCommunity.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public spend(
    recipient: AccAddress,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      spend: {
        recipient,
        amount: new Int(amount).toString()
      }
    });
  }

  public async getConfig(): Promise<MirrorCommunity.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorCommunity.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    executeMsg: MirrorCommunity.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(executeMsg, coins);
  }
}
