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

  export interface HandleDistribute {
    distribute: EmptyObject;
  }

  export interface HookDepositReward {
    deposit_reward: EmptyObject;
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

  export type HandleMsg = HandleConvert | HandleDistribute;
  export type HookMsg = HookDepositReward;
  export type QueryMsg = QueryConfig;
}

function createHookMsg(msg: MirrorCollector.HookMsg): string {
  return Buffer.from(JSON.stringify(msg)).toString('base64');
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

    return asset_token.send(
      this.contractAddress,
      amount,
      createHookMsg({
        deposit_reward: {}
      })
    );
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
