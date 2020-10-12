import { ContractClient } from './ContractClient';
import {
  AccAddress,
  BlockTxBroadcastResult,
  Coins,
  Dec,
  Numeric,
} from '@terra-money/terra.js';
import { EmptyObject } from 'utilTypes';

export namespace MirrorOracle {
  export interface UpdateConfig {
    update_config: {
      owner?: AccAddress;
    };
  }

  export interface RegisterAsset {
    register_asset: {
      asset_token: AccAddress;
      feeder: AccAddress;
    };
  }

  export interface PriceInfo {
    asset_token: AccAddress;
    price: string;
    price_multiplier?: string;
  }

  export interface FeedPrice {
    feed_price: {
      price_infos: Array<PriceInfo>;
    };
  }

  export interface Config {
    config: EmptyObject;
  }

  export interface Asset {
    asset: { asset_token: AccAddress };
  }

  export interface Price {
    price: { asset_token: AccAddress };
  }

  export interface Prices {
    prices: EmptyObject;
  }

  export interface ConfigResponse {
    owner: AccAddress;
    base_asset_info: AccAddress;
  }

  export interface AssetResponse {
    asset_token: AccAddress;
    feeder: AccAddress;
  }

  export interface PriceResponse {
    price: string;
    price_multipler: string;
    last_update_time: number;
    asset_token: AccAddress;
  }

  export interface PricesResponse {}

  export type HandleMsg = UpdateConfig | RegisterAsset | FeedPrice;
  export type QueryMsg = Config | Asset | Price | Prices;
}

export class MirrorOracle extends ContractClient {
  public async updateConfig(
    config: MirrorOracle.UpdateConfig['update_config']
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      update_config: config,
    });
  }

  public async registerAsset(
    asset_token: AccAddress,
    feeder: AccAddress
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      register_asset: {
        asset_token,
        feeder,
      },
    });
  }

  public async feedPrice(
    price_infos: Array<{
      asset_token: AccAddress;
      price: Numeric.Input;
      price_multiplier?: Numeric.Input;
    }>
  ): Promise<BlockTxBroadcastResult> {
    return this.broadcastExecute({
      feed_price: {
        price_infos: price_infos.map(pi => ({
          asset_token: pi.asset_token,
          price: new Dec(pi.price).toFixed(),
          price_multiplier:
            pi.price_multiplier !== undefined
              ? new Dec(pi.price_multiplier).toFixed()
              : undefined,
        })),
      },
    });
  }

  public async getConfig(): Promise<MirrorOracle.ConfigResponse> {
    return this.query({
      config: {},
    });
  }

  public async getAsset(
    asset_token: AccAddress
  ): Promise<MirrorOracle.AssetResponse> {
    return this.query({
      asset: { asset_token },
    });
  }

  public async getPrice(
    asset_token: AccAddress
  ): Promise<MirrorOracle.PriceResponse> {
    return this.query({
      price: { asset_token },
    });
  }
  public async getPrices(): Promise<MirrorOracle.PricesResponse> {
    return this.query({
      prices: {},
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorOracle.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected async broadcastExecute(
    execute_msg: MirrorOracle.HandleMsg,
    coins: Coins.Input = {}
  ): Promise<BlockTxBroadcastResult> {
    return super.broadcastExecute(execute_msg, coins);
  }
}
