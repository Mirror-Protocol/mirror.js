/* eslint-disable camelcase */
import {
  AccAddress,
  Coins,
  Numeric,
  MsgInstantiateContract,
  MsgExecuteContract,
  Int
} from '@terra-money/terra.js';
import { ContractClient } from './ContractClient';
import { EmptyObject } from '../utils/EmptyObject';
import { TerraswapToken } from './TerraswapToken';

export namespace MirrorStaking {
  export interface InitMsg {
    owner: AccAddress;
    mirror_token: AccAddress;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
    };
  }

  export interface HandleRegisterAsset {
    register_asset: {
      asset_token: AccAddress;
      staking_token: AccAddress;
    };
  }

  export interface HandleUnbond {
    unbond: {
      asset_token: AccAddress;
      amount: string;
    };
  }

  export interface HandleWithdraw {
    withdraw: {
      asset_token?: AccAddress;
    };
  }

  export interface HookBond {
    bond: {
      asset_token: AccAddress;
    };
  }

  export interface HookDepositReward {
    deposit_reward: {
      asset_token: AccAddress;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryPoolInfo {
    pool_info: {
      asset_token: AccAddress;
    };
  }

  export interface QueryRewardInfo {
    reward_info: {
      staker: AccAddress;
      asset_token?: AccAddress;
    };
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mirror_token: AccAddress;
  }

  export interface PoolInfoResponse {
    asset_token: AccAddress;
    staking_token: AccAddress;
    total_bond_amount: string;
    reward_index: string;
  }

  export interface RewardInfoResponseItem {
    asset_token: AccAddress;
    index: string;
    bond_amount: string;
    pending_reward: string;
  }

  export interface RewardInfoResponse {
    staker: AccAddress;
    reward_infos: Array<RewardInfoResponseItem>;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleRegisterAsset
    | HandleUnbond
    | HandleWithdraw;

  export type HookMsg = HookBond | HookDepositReward;

  export type QueryMsg = QueryConfig | QueryPoolInfo | QueryRewardInfo;
}

function createHookMsg(msg: MirrorStaking.HookMsg): string {
  return Buffer.from(JSON.stringify(msg)).toString('base64');
}

export class MirrorStaking extends ContractClient {
  public init(
    init_msg: MirrorStaking.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public updateConfig(
    config: MirrorStaking.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public registerAsset(
    asset_token: AccAddress,
    staking_token: AccAddress
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      register_asset: {
        asset_token,
        staking_token
      }
    });
  }

  public unbond(
    asset_token: AccAddress,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      unbond: {
        asset_token,
        amount: new Int(amount).toString()
      }
    });
  }

  public withdraw(asset_token?: AccAddress): MsgExecuteContract {
    return this.createExecuteMsg({
      withdraw: {
        asset_token
      }
    });
  }

  public bond(
    asset_token: AccAddress,
    amount: Numeric.Input,
    lp_token: TerraswapToken
  ): MsgExecuteContract {
    if (!this.contractAddress) {
      throw new Error(
        'contractAddress not provided - unable to execute message'
      );
    }

    if (this.wallet.key.accAddress !== lp_token.wallet.key.accAddress) {
      throw new Error('two contract instance is not from the same key');
    }

    return lp_token.send(
      this.contractAddress,
      amount,
      createHookMsg({
        bond: {
          asset_token
        }
      })
    );
  }

  public depositReward(
    asset_token: AccAddress,
    amount: Numeric.Input,
    mirror_token: TerraswapToken
  ): MsgExecuteContract {
    if (!this.contractAddress) {
      throw new Error(
        'contractAddress not provided - unable to execute message'
      );
    }

    return mirror_token.send(
      this.contractAddress,
      amount,
      createHookMsg({
        deposit_reward: {
          asset_token
        }
      })
    );
  }

  public async getConfig(): Promise<MirrorStaking.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getPoolInfo(
    asset_token: AccAddress
  ): Promise<MirrorStaking.PoolInfoResponse> {
    return this.query({
      pool_info: {
        asset_token
      }
    });
  }

  public async getRewardInfo(
    staker: AccAddress,
    asset_token?: AccAddress
  ): Promise<MirrorStaking.RewardInfoResponse> {
    return this.query({
      reward_info: {
        staker,
        asset_token
      }
    });
  }

  protected async query<T>(query_msg: MirrorStaking.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    execute_msg: MirrorStaking.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(execute_msg, coins);
  }
}
