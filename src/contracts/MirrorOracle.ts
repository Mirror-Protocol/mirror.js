import {
  AccAddress,
  Coins,
  Dec,
  Numeric,
  MsgInstantiateContract,
  MsgExecuteContract
} from '@terra-money/terra.js';
import { AssetInfo } from '../utils/Asset';
import { ContractClient } from './ContractClient';
import { EmptyObject } from '../utils/EmptyObject';

export namespace MirrorOracle {
  export interface InitMsg {
    owner: AccAddress;
    base_asset_info: AssetInfo;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
    };
  }

  export interface HandleRegisterAsset {
    register_asset: {
      asset_token: AccAddress;
      feeder: AccAddress;
    };
  }

  export interface PriceInfo {
    asset_token: AccAddress;
    price: string;
  }

  export interface HandleFeedPrice {
    feed_price: {
      price_infos: Array<PriceInfo>;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryAsset {
    asset: { asset_token: AccAddress };
  }

  export interface QueryPrice {
    price: { asset_token: AccAddress };
  }

  export interface QueryPrices {
    prices: EmptyObject;
  }

  export interface ConfigResponse {
    owner: AccAddress;
    base_asset_info: AssetInfo;
  }

  export interface AssetResponse {
    asset_token: AccAddress;
    feeder: AccAddress;
  }

  export interface PriceResponse {
    price: string;
    last_update_time: number;
    asset_token: AccAddress;
  }

  export interface PricesResponse {
    prices: Array<PriceResponse>;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleRegisterAsset
    | HandleFeedPrice;

  export type QueryMsg = QueryConfig | QueryAsset | QueryPrice | QueryPrices;
}

export class MirrorOracle extends ContractClient {
  public init(
    init_msg: MirrorOracle.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public updateConfig(
    config: MirrorOracle.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public registerAsset(
    asset_token: AccAddress,
    feeder: AccAddress
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      register_asset: {
        asset_token,
        feeder
      }
    });
  }

  public feedPrice(
    price_infos: Array<{
      asset_token: AccAddress;
      price: Numeric.Input;
    }>
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      feed_price: {
        price_infos: price_infos.map((pi) => ({
          asset_token: pi.asset_token,
          price: new Dec(pi.price).toFixed()
        }))
      }
    });
  }

  public async getConfig(): Promise<MirrorOracle.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getAsset(
    asset_token: AccAddress
  ): Promise<MirrorOracle.AssetResponse> {
    return this.query({
      asset: { asset_token }
    });
  }

  public async getPrice(
    asset_token: AccAddress
  ): Promise<MirrorOracle.PriceResponse> {
    return this.query({
      price: { asset_token }
    });
  }

  public async getPrices(): Promise<MirrorOracle.PricesResponse> {
    return this.query({
      prices: {}
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorOracle.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    execute_msg: MirrorOracle.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(execute_msg, coins);
  }
}
