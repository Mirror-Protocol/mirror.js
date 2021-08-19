import {
  AccAddress,
  Coins,
  Int,
  Numeric,
  MsgInstantiateContract,
  MsgExecuteContract
} from '@terra-money/terra.js';
import { ContractClient } from './ContractClient';
import { EmptyObject } from '../utils/EmptyObject';

export namespace MirrorLock {
  export interface InitMsg {
    owner: AccAddress;
    mint_contract: AccAddress;
    base_denom: string;
    lockup_period: number;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      mint_contract?: AccAddress;
      base_denom?: string;
      lockup_period?: number;
    };
  }

  export interface HandleLockPositionFundsHook {
    lock_position_funds_hook: {
      position_idx: string;
      receiver: AccAddress;
    };
  }

  export interface HandleUnlockPositionFunds {
    unlock_position_funds: {
      positions_idx: Array<string>;
    };
  }

  export interface HandleReleasePositionFunds {
    release_position_funds: {
      position_idx: string;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryPositionLockInfo {
    position_lock_info: {
      position_idx: string;
    };
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mint_contract: AccAddress;
    base_denom: string;
    lockup_period: number;
  }

  export interface PositionLockInfoResponse {
    idx: string;
    receiver: AccAddress;
    locked_funds: Array<[number, string]>;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleLockPositionFundsHook
    | HandleUnlockPositionFunds
    | HandleReleasePositionFunds;

  export type QueryMsg = QueryConfig | QueryPositionLockInfo;
}

export class MirrorLock extends ContractClient {
  public init(init_msg: MirrorLock.InitMsg): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {});
  }

  public updateConfig(
    config: MirrorLock.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public lockPositionFundsHook(
    position_idx: Numeric.Input,
    receiver: AccAddress
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      lock_position_funds_hook: {
        position_idx: new Int(position_idx).toString(),
        receiver
      }
    });
  }

  public unlockPositionFunds(positions_idx: Array<string>): MsgExecuteContract {
    return this.createExecuteMsg({
      unlock_position_funds: {
        positions_idx
      }
    });
  }

  public releasePositionFunds(position_idx: Numeric.Input): MsgExecuteContract {
    return this.createExecuteMsg({
      release_position_funds: {
        position_idx: new Int(position_idx).toString()
      }
    });
  }

  public async getConfig(): Promise<MirrorLock.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getPositionLockInfo(
    position_idx: Numeric.Input
  ): Promise<MirrorLock.PositionLockInfoResponse> {
    return this.query({
      position_lock_info: {
        position_idx: new Int(position_idx).toString()
      }
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorLock.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    execute_msg: MirrorLock.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(execute_msg, coins);
  }
}
