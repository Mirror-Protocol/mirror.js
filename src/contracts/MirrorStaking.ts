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
    mint_contract: AccAddress;
    oracle_contract: AccAddress;
    terraswap_factory: AccAddress;
    base_denom: string;
    premium_min_update_interval: number;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      premium_min_update_interval?: number;
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

  export interface HandleAdjustPremium {
    adjust_premium: {
      asset_tokens: Array<AccAddress>;
    };
  }

  export interface HandleIncreaseShortToken {
    increase_short_token: {
      asset_token: AccAddress;
      staker_addr: AccAddress;
      amount: string;
    };
  }

  export interface HandleDecreaseShortToken {
    decrease_short_token: {
      asset_token: AccAddress;
      staker_addr: AccAddress;
      amount: string;
    };
  }

  export interface HookBond {
    bond: {
      asset_token: AccAddress;
    };
  }

  export interface HookDepositReward {
    deposit_reward: {
      rewards: Array<[AccAddress, string]>;
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
      staker_addr: AccAddress;
      asset_token?: AccAddress;
    };
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mirror_token: AccAddress;
    mint_contract: AccAddress;
    oracle_contract: AccAddress;
    terraswap_factory: AccAddress;
    base_denom: string;
    premium_min_update_interval: number;
  }

  export interface PoolInfoResponse {
    asset_token: AccAddress;
    staking_token: AccAddress;
    total_bond_amount: string;
    total_short_amount: string;
    reward_index: string;
    short_reward_index: string;
    pending_reward: string;
    short_pending_reward: string;
    premium_rate: string;
    premium_updated_time: number;
  }

  export interface RewardInfoResponseItem {
    asset_token: AccAddress;
    bond_amount: string;
    pending_reward: string;
    is_short: boolean;
  }

  export interface RewardInfoResponse {
    staker_addr: AccAddress;
    reward_infos: Array<RewardInfoResponseItem>;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleRegisterAsset
    | HandleUnbond
    | HandleWithdraw
    | HandleAdjustPremium
    | HandleDecreaseShortToken
    | HandleIncreaseShortToken;

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
          rewards: [[asset_token, new Int(amount).toString()]]
        }
      })
    );
  }

  public adjustPremium(asset_tokens: Array<AccAddress>): MsgExecuteContract {
    return this.createExecuteMsg({
      adjust_premium: {
        asset_tokens
      }
    });
  }

  public increaseShortToken(
    asset_token: AccAddress,
    staker_addr: AccAddress,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      increase_short_token: {
        asset_token,
        staker_addr,
        amount: new Int(amount).toString()
      }
    });
  }

  public decreaseShortToken(
    asset_token: AccAddress,
    staker_addr: AccAddress,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      decrease_short_token: {
        asset_token,
        staker_addr,
        amount: new Int(amount).toString()
      }
    });
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
        staker_addr: staker,
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
