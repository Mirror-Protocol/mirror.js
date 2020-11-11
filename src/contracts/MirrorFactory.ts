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
    token_code_id: number;
    base_denom: string;
    // [start_elapsed, end_elapsed, distribution_amount]
    distribution_schedule: Array<[number, number, string]>;
  }

  export interface Params {
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
      token_code_id?: number;
      // [start_elapsed, end_elapsed, distribution_amount]
      distribution_schedule?: Array<[number, number, string]>;
    };
  }

  export interface HandleTerraswapCreationHook {
    terraswap_creation_hook: {
      asset_token: AccAddress;
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

  export interface HandleDistribute {
    distribute: EmptyObject;
  }

  export interface HandleMigrateAsset {
    migrate_asset: {
      name: string;
      symbol: string;
      from_token: AccAddress;
      end_price: string;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryDistributionInfo {
    distribution_info: EmptyObject;
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mirror_token: AccAddress;
    mint_contract: AccAddress;
    staking_contract: AccAddress;
    commission_collector: AccAddress;
    oracle_contract: AccAddress;
    terraswap_factory: AccAddress;
    token_code_id: number;
    base_denom: string;
    // [start_elapsed, end_elapsed, distribution_amount]
    distribution_schedule: Array<[number, number, string]>;
  }

  export interface DistributionInfoResponse {
    weight: Array<[AccAddress, number]>;
    last_distributed: number;
  }

  export type HandleMsg =
    | HandlePostInitialize
    | HandleUpdateConfig
    | HandleTerraswapCreationHook
    | HandleWhitelist
    | HandlePassCommand
    | HandleDistribute
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

  public updateConfig(
    config: MirrorFactory.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public terraswapCreationHook(asset_token: AccAddress): MsgExecuteContract {
    return this.createExecuteMsg({
      terraswap_creation_hook: {
        asset_token
      }
    });
  }

  public whitelist(
    name: string,
    symbol: string,
    oracle_feeder: AccAddress,
    params: {
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
    end_price: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      migrate_asset: {
        name,
        symbol,
        from_token,
        end_price: new Dec(end_price).toString()
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

  public distribute(): MsgExecuteContract {
    return this.createExecuteMsg({
      distribute: {}
    });
  }

  public async getConfig(): Promise<MirrorFactory.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getDistributionInfo(): Promise<
    MirrorFactory.DistributionInfoResponse
  > {
    return this.query({
      distribution_info: {}
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
