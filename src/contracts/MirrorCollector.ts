import { EmptyObject } from 'utilTypes';
import { ContractClient } from './ContractClient';
import {
  AccAddress,
  BlockTxBroadcastResult,
  Coins,
} from '@terra-money/terra.js';

export namespace MirrorCollector {
  export interface Convert {
    convert: {
      asset_token: AccAddress;
    };
  }

  export interface Send {
    send: EmptyObject;
  }

  export interface Config {
    config: EmptyObject;
  }

  export interface ConfigResponse {
    distribution_contract: AccAddress;
    terraswap_factory: AccAddress;
    mirror_token: AccAddress;
    base_denom: string;
  }

  export type HandleMsg = Convert | Send;
  export type QueryMsg = Config;
}
export class MirrorCollector extends ContractClient {
  public async convert(
    asset_token: AccAddress
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      convert: {
        asset_token,
      },
    });
  }

  public async send(): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      send: {},
    });
  }

  public async getConfig(): Promise<MirrorCollector.ConfigResponse> {
    return this.query({
      config: {},
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorCollector.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected async broadcastExecute(
    execute_msg: MirrorCollector.HandleMsg,
    coins: Coins.Input = {}
  ): Promise<BlockTxBroadcastResult> {
    return super.broadcastExecute(execute_msg, coins);
  }
}
