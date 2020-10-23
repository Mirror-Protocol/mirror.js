import {
  AccAddress,
  Coins,
  Dec,
  Numeric,
  MsgExecuteContract,
  MsgInstantiateContract
} from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { ContractClient } from './ContractClient';

export namespace MirrorFactory {
  export interface InitMsg {
    mint_per_block: string;
    token_code_id: number;
    base_denom: string;
  }

  export interface Params {
    weight: string;
    lp_commission: string;
    owner_commission: string;
    auction_discount: string;
    min_collateral_ratio: string;
  }

  export interface HandlePostInitialize {
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

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      mint_per_block?: string;
      token_code_id?: number;
    };
  }

  export interface HandleUpdateWeight {
    update_weight: {
      asset_token: AccAddress;
      weight: string;
    };
  }

  export interface HandleWhitelist {
    whitelist: {
      name: string;
      symbol: string;
      oracle_feeder: AccAddress;
      params: Params;
    };
  }

  export interface HandlePassCommand {
    pass_command: {
      contract_addr: AccAddress;
      msg: string;
    };
  }

  export interface HandleMint {
    mint: {
      asset_token: AccAddress;
    };
  }

  export interface HandleMigrateAsset {
    migrate_asset: {
      name: string;
      symbol: string;
      from_token: AccAddress;
      conversion_rate: string;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryDistributionInfo {
    distribution_info: { asset_token: AccAddress };
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mirror_token: AccAddress;
    mint_contract: AccAddress;
    staking_contract: AccAddress;
    commission_collector: AccAddress;
    oracle_contract: AccAddress;
    terraswap_factory: AccAddress;
    mint_per_block: string;
    token_code_id: number;
    base_denom: string;
  }

  export interface DistributionInfoResponse {
    weight: string;
    last_height: number;
  }

  export type HandleMsg =
    | HandlePostInitialize
    | HandleUpdateWeight
    | HandleUpdateConfig
    | HandleWhitelist
    | HandlePassCommand
    | HandleMint
    | HandleMigrateAsset;

  export type QueryMsg = QueryConfig | QueryDistributionInfo;
}

export class MirrorFactory extends ContractClient {
  public init(
    init_msg: MirrorFactory.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public postInitialize(
    owner: AccAddress,
    terraswap_factory: AccAddress,
    mirror_token: AccAddress,
    staking_contract: AccAddress,
    oracle_contract: AccAddress,
    mint_contract: AccAddress,
    commission_collector: AccAddress
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      post_initialize: {
        owner,
        terraswap_factory,
        mirror_token,
        staking_contract,
        oracle_contract,
        mint_contract,
        commission_collector
      }
    });
  }

  public updateWeight(
    asset_token: AccAddress,
    weight: Dec
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_weight: {
        asset_token,
        weight: weight.toFixed()
      }
    });
  }

  public updateConfig(
    config: MirrorFactory.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public whitelist(
    name: string,
    symbol: string,
    oracle_feeder: AccAddress,
    params: {
      weight: Numeric.Input;
      lp_commission: Numeric.Input;
      owner_commission: Numeric.Input;
      auction_discount: Numeric.Input;
      min_collateral_ratio: Numeric.Input;
    }
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      whitelist: {
        name,
        symbol,
        oracle_feeder,
        params: {
          weight: new Dec(params.weight).toFixed(),
          lp_commission: new Dec(params.lp_commission).toFixed(),
          owner_commission: new Dec(params.owner_commission).toFixed(),
          auction_discount: new Dec(params.auction_discount).toFixed(),
          min_collateral_ratio: new Dec(params.min_collateral_ratio).toFixed()
        }
      }
    });
  }

  public migrateAsset(
    name: string,
    symbol: string,
    from_token: AccAddress,
    conversion_rate: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      migrate_asset: {
        name,
        symbol,
        from_token,
        conversion_rate: new Dec(conversion_rate).toString()
      }
    });
  }

  public passCommand(contract_addr: AccAddress, msg: any): MsgExecuteContract {
    return this.createExecuteMsg({
      pass_command: {
        contract_addr,
        msg: Buffer.from(JSON.stringify(msg)).toString('base64')
      }
    });
  }

  public mint(asset_token: AccAddress): MsgExecuteContract {
    return this.createExecuteMsg({
      mint: {
        asset_token
      }
    });
  }

  public async getConfig(): Promise<MirrorFactory.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getDistributionInfo(
    asset_token: AccAddress
  ): Promise<MirrorFactory.DistributionInfoResponse> {
    return this.query({
      distribution_info: { asset_token }
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorFactory.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    executeMsg: MirrorFactory.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(executeMsg, coins);
  }
}
