import {
  AccAddress,
  BlockTxBroadcastResult,
  Coins,
  Numeric,
  Int,
} from '@terra-money/terra.js';
import { EmptyObject } from 'utilTypes';
import { ContractClient } from './ContractClient';
import { MirrorOracle } from './MirrorOracle';

export namespace MirrorMint {
  export interface UpdateConfig {
    update_config: {
      owner?: AccAddress;
      token_code_id?: number;
    };
  }

  export interface UpdateAsset {}

  export interface RegisterAsset {}

  export interface OpenPosition {}

  export interface Deposit {}

  export interface Withdraw {}

  export interface Mint {}

  export interface Query {}

  export interface Config {
    config: EmptyObject;
  }

  export interface AssetConfig {
    asset_config: {
      asset_info: string;
    };
  }

  export interface Position {
    position: {
      position_idx: string;
    };
  }

  export interface Positions {
    positions: {
      ownder_addr: AccAddress;
      start_after?: string;
      limit?: number;
    };
  }

  export type HandleMsg =
    | UpdateConfig
    | UpdateAsset
    | RegisterAsset
    | OpenPosition
    | Deposit
    | Withdraw
    | Mint;

  export type QueryMsg = Config | AssetConfig | Position | Positions;
}

export class MirrorMint extends ContractClient {
  public async updateConfig(
    config: MirrorMint.UpdateConfig['update_config']
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute(config);
  }

  public async updateAsset(): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute();
  }

  public async registerAsset(): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute();
  }

  public async openPosition(): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute();
  }

  public async deposit(): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute();
  }

  public async withdraw(): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute();
  }

  public async mint(): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute();
  }

  public async getConfig(): Promise<MirrorMint.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getAssetConfig(): Promise<MirrorMint.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getPosition(): Promise<MirrorMint.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getPositions(owner_addr: AccAddress, start_after?: Numeric.Input, limit?: number): Promise<MirrorMint.ConfigResponse> {
    return this.query({
      positions: {
        owner_addr,
        start_after: (start_after !== undefined) ? new Int(start_after).toString() : undefined,
        limit
      }
    })
  }


  // Typed overloads

  protected async query<T>(query_msg: MirrorMint.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected async broadcastExecute(
    execute_msg: MirrorMint.HandleMsg,
    coins: Coins.Input = {}
  ): Promise<BlockTxBroadcastResult> {
    return super.broadcastExecute(execute_msg, coins);
  }
}
}
