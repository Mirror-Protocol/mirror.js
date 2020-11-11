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
    base_asset: string;
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

  export interface HandleFeedPrice {
    feed_price: {
      prices: Array<[AccAddress, string]>;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryFeeder {
    feeder: {
      asset_token: AccAddress;
    };
  }

  export interface QueryPrice {
    price: {
      base_asset: string;
      quote_asset: string;
    };
  }

  export interface QueryPrices {
    prices: {
      start_after?: AccAddress;
      limit?: number;
    };
  }

  export interface ConfigResponse {
    owner: AccAddress;
    base_asset: string;
  }

  export interface FeederResponse {
    asset_token: AccAddress;
    feeder: AccAddress;
  }

  export interface PriceResponse {
    rate: string;
    last_updated_base: number;
    last_updated_quote: number;
  }

  export interface PricesResponseElem {
    price: string;
    asset_token: AccAddress;
    last_updated_time: number;
  }

  export interface PricesResponse {
    prices: Array<PricesResponseElem>;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleRegisterAsset
    | HandleFeedPrice;

  export type QueryMsg = QueryConfig | QueryFeeder | QueryPrice | QueryPrices;
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
    prices: Array<{
      asset_token: AccAddress;
      price: Numeric.Input;
    }>
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      feed_price: {
        prices: prices.map((p) => [p.asset_token, new Dec(p.price).toFixed()])
      }
    });
  }

  public async getConfig(): Promise<MirrorOracle.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getFeeder(
    asset_token: AccAddress
  ): Promise<MirrorOracle.FeederResponse> {
    return this.query({
      feeder: { asset_token }
    });
  }

  public async getPrice(
    base_asset: string,
    quote_asset: string
  ): Promise<MirrorOracle.PriceResponse> {
    return this.query({
      price: { base_asset, quote_asset }
    });
  }

  public async getPrices(
    start_after?: AccAddress,
    limit?: number
  ): Promise<MirrorOracle.PricesResponse> {
    return this.query({
      prices: { start_after, limit }
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
