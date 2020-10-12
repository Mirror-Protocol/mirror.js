import {
  AccAddress,
  BlockTxBroadcastResult,
  Dec,
  MsgExecuteContract,
  TxBroadcastResult,
} from '@terra-money/terra.js';
import { ContractClient } from './ContractClient';

export namespace MirrorFactory {
  export interface Params {
    weight: string;
    lp_commission: string;
    owner_commission: string;
    auction_discount: string;
    min_collateral_ratio: string;
  }

  export namespace HandleMsg {
    export interface PostInitialize {
      post_initialize: {
        owner: AccAddress;
        terraswap_factory: AccAddress;
        mirror_token: AccAddress;
        staking_contract: AccAddress;
        oracle_contract: AccAddress;
        mint_contract: AccAddress;
        commission_collector: AccAddress;
      };
    }

    export interface UpdateWeight {
      update_weight: {
        asset_token: AccAddress;
        weight: string;
      };
    }

    export type UpdateConfig = {
      update_config: Partial<PostInitialize['post_initialize']>;
    };

    export interface Whitelist {
      name: string;
      symbol: string;
      oracle_feeder: AccAddress;
      params: Params;
    }
  }
}

export class MirrorFactory extends ContractClient {
  public static postInitialize(
    owner: AccAddress,
    terraswap_factory: AccAddress,
    mirror_token: AccAddress,
    staking_contract: AccAddress,
    oracle_contract: AccAddress,
    mint_contract: AccAddress,
    commission_collector: AccAddress
  ): MirrorFactory.HandleMsg.PostInitialize {
    return {
      post_initialize: {
        owner,
        terraswap_factory,
        mirror_token,
        staking_contract,
        oracle_contract,
        mint_contract,
        commission_collector,
      },
    };
  }

  public async postInitialize(
    owner: AccAddress,
    terraswap_factory: AccAddress,
    mirror_token: AccAddress,
    staking_contract: AccAddress,
    oracle_contract: AccAddress,
    mint_contract: AccAddress,
    commission_collector: AccAddress
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute(
      MirrorFactory.postInitialize(
        owner,
        terraswap_factory,
        mirror_token,
        staking_contract,
        oracle_contract,
        mint_contract,
        commission_collector
      )
    );
  }

  public static updateWeight(
    asset_token: AccAddress,
    weight: Dec
  ): MirrorFactory.HandleMsg.UpdateWeight {
    return {
      update_weight: {
        asset_token,
        weight: weight.toFixed(),
      },
    };
  }

  public async updateWeight(
    asset_token: AccAddress,
    weight: Dec
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute(
      MirrorFactory.updateWeight(asset_token, weight)
    );
  }

  public static updateConfig(
    config: MirrorFactory.HandleMsg.UpdateConfig['update_config']
  ): MirrorFactory.HandleMsg.UpdateConfig {
    return {
      update_config: config,
    };
  }

  public async updateConfig(
    config: MirrorFactory.HandleMsg.UpdateConfig['update_config']
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute(MirrorFactory.updateConfig(config));
  }

  public static whitelist(
    name: string,
    symbol: string,
    oracle_feeder: AccAddress,
    params: MirrorFactory.Params
  ): MirrorFactory.HandleMsg.Whitelist {
    return {
      name,
      symbol,
      oracle_feeder,
      params,
    };
  }

  public async whitelist(): Promise<void> {}
  public async tokenCreationHook(): Promise<void> {}
  public async uniswapCreationHook(): Promise<void> {}
  public async passCommand(): Promise<void> {}
  public async mint(): Promise<void> {}

  public async getConfig(): Promise<Config> {}
  public async getDistribtionInfo(): Promise<DistributionInfo> {}
}
