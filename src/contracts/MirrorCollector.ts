import {
  AccAddress,
  Coins,
  MsgExecuteContract,
  MsgInstantiateContract,
  Numeric
} from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { ContractClient } from './ContractClient';
import { TerraswapToken } from './TerraswapToken';

export namespace MirrorCollector {
  export interface InitMsg {
    owner: AccAddress;
    distribution_contract: AccAddress;
    terraswap_factory: AccAddress;
    mirror_token: AccAddress;
    base_denom: string;
    aust_token: AccAddress;
    anchor_market: AccAddress;
    bluna_token: AccAddress;
    bluna_swap_denom: string;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      distribution_contract?: AccAddress;
      terraswap_factory?: AccAddress;
      mirror_token?: AccAddress;
      base_denom?: string;
      aust_token?: AccAddress;
      anchor_market?: AccAddress;
      bluna_token?: AccAddress;
      bluna_swap_denom?: string;
    };
  }

  export interface HandleConvert {
    convert: {
      asset_token: AccAddress;
    };
  }

  export interface HandleDistribute {
    distribute: EmptyObject;
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface ConfigResponse {
    owner: AccAddress;
    distribution_contract: AccAddress;
    terraswap_factory: AccAddress;
    mirror_token: AccAddress;
    base_denom: string;
    aust_token: AccAddress;
    anchor_market: AccAddress;
    bluna_token: AccAddress;
    bluna_swap_denom: string;
  }

  export type HandleMsg = HandleConvert | HandleDistribute | HandleUpdateConfig;
  export type QueryMsg = QueryConfig;
}

export class MirrorCollector extends ContractClient {
  public init(init_msg: MirrorCollector.InitMsg): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {});
  }

  public updateConfig(
    config: MirrorCollector.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
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
      distribute: {}
    });
  }

  public depositReward(
    asset_token: TerraswapToken,
    amount: Numeric.Input
  ): MsgExecuteContract {
    if (!this.contractAddress) {
      throw new Error(
        'contractAddress not provided - unable to execute message'
      );
    }

    return asset_token.send(this.contractAddress, amount, undefined);
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
