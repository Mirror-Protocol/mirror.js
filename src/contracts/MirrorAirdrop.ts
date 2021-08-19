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

export namespace MirrorAirdrop {
  export interface InitMsg {
    owner: AccAddress;
    mirror_token: AccAddress;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
    };
  }

  export interface HandleUpdateMerkleRoot {
    update_merkle_root: {
      stage: number;
      merkle_root: string;
    };
  }

  export interface HandleRegisterMerkleRoot {
    register_merkle_root: {
      merkle_root: string;
    };
  }

  export interface HandleClaim {
    claim: {
      stage: number;
      amount: string;
      proof: Array<string>;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryMerkleRoot {
    merkle_root: {
      stage: number;
    };
  }

  export interface QueryLatestStage {
    latest_stage: EmptyObject;
  }

  export interface QueryIsClaimed {
    is_claimed: {
      stage: number;
      address: string;
    };
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mirror_token: AccAddress;
  }

  export interface MerkleRootResponse {
    stage: number;
    merkle_root: string;
  }

  export interface LatestStageResponse {
    latest_stage: number;
  }

  export interface IsClaimedResponse {
    is_claimed: boolean;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleUpdateMerkleRoot
    | HandleRegisterMerkleRoot
    | HandleClaim;
  export type QueryMsg =
    | QueryConfig
    | QueryMerkleRoot
    | QueryLatestStage
    | QueryIsClaimed;
}

export class MirrorAirdrop extends ContractClient {
  public init(init_msg: MirrorAirdrop.InitMsg): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {});
  }

  public updateConfig(
    config: MirrorAirdrop.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public updateMerkleRoot(
    stage: number,
    merkleRoot: string
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_merkle_root: {
        stage,
        merkle_root: merkleRoot
      }
    });
  }

  public registerMerkleRoot(merkleRoot: string): MsgExecuteContract {
    return this.createExecuteMsg({
      register_merkle_root: {
        merkle_root: merkleRoot
      }
    });
  }

  public claim(
    stage: number,
    amount: Numeric.Input,
    proof: Array<string>
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      claim: {
        stage,
        amount: new Int(amount).toString(),
        proof
      }
    });
  }

  public async getConfig(): Promise<MirrorAirdrop.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getMerkleRoot(
    stage: number
  ): Promise<MirrorAirdrop.MerkleRootResponse> {
    return this.query({
      merkle_root: {
        stage
      }
    });
  }

  public async getLatestStage(): Promise<MirrorAirdrop.LatestStageResponse> {
    return this.query({
      latest_stage: {}
    });
  }

  public async getIsClaimed(
    stage: number,
    address: AccAddress
  ): Promise<MirrorAirdrop.IsClaimedResponse> {
    return this.query({
      is_claimed: {
        stage,
        address
      }
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorAirdrop.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    executeMsg: MirrorAirdrop.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(executeMsg, coins);
  }
}
