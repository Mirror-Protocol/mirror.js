import {
  AccAddress,
  Coins,
  MsgInstantiateContract,
  MsgExecuteContract,
  Numeric,
  Dec
} from '@terra-money/terra.js';
import { AssetInfo } from '../utils/Asset';
import { ContractClient } from './ContractClient';
import { EmptyObject } from '../utils/EmptyObject';

export namespace MirrorCollateralOracle {
  export interface InitMsg {
    owner: AccAddress;
    mint_contract: AccAddress;
    mirror_oracle: AccAddress;
    anchor_oracle: AccAddress;
    band_oracle: AccAddress;
    base_denom: string;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      mint_contract?: AccAddress;
      mirror_oracle?: AccAddress;
      anchor_oracle?: AccAddress;
      band_oracle?: AccAddress;
      base_denom?: string;
    };
  }

  export interface MirrorOracle {
    mirror_oracle: EmptyObject;
  }
  export interface AnchorOracle {
    anchor_oracle: EmptyObject;
  }
  export interface BandOracle {
    band_oracle: EmptyObject;
  }
  export interface Terraswap {
    terraswap: {
      terraswap_pair_addr: AccAddress;
      intermediate_denom?: string;
    };
  }
  export interface AnchorMarket {
    anchor_market: {
      anchor_market_addr: AccAddress;
    };
  }
  export interface FixedPrice {
    fixed_price: {
      price: string;
    };
  }
  export interface Native {
    native: {
      native_denom: string;
    };
  }
  export type SourceType =
    | MirrorOracle
    | AnchorOracle
    | AnchorMarket
    | Native
    | Terraswap
    | BandOracle
    | FixedPrice;

  export interface HandleRegisterCollateralAsset {
    register_collateral_asset: {
      asset: AssetInfo;
      price_source: SourceType;
      multiplier: string;
    };
  }

  export interface HandleRevokeCollateralAsset {
    revoke_collateral_asset: {
      asset: AssetInfo;
    };
  }

  export interface HandleUpdateCollateralPriceSource {
    update_collateral_price_source: {
      asset: AssetInfo;
      price_source: SourceType;
    };
  }

  export interface HandleUpdateCollateralMultiplier {
    update_collateral_multiplier: {
      asset: AssetInfo;
      multiplier: string;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryCollateralPrice {
    collateral_price: {
      asset: string;
    };
  }

  export interface QueryCollateralAssetInfo {
    collateral_asset_info: {
      asset: string;
    };
  }

  export interface QueryCollateralAssetInfos {
    collateral_asset_infos: EmptyObject;
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mint_contract: AccAddress;
    mirror_oracle: AccAddress;
    anchor_oracle: AccAddress;
    band_oracle: AccAddress;
    base_denom: string;
  }

  export interface CollateralPriceResponse {
    asset: AccAddress;
    rate: string;
    last_updated: number;
    multiplier: string;
    is_revoked: boolean;
  }

  export interface CollateralInfoResponse {
    asset: AccAddress;
    multiplier: string;
    source_type: string;
    is_revoked: boolean;
  }

  export interface CollateralInfosResponse {
    collaterals: Array<CollateralInfoResponse>;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleRegisterCollateralAsset
    | HandleRevokeCollateralAsset
    | HandleUpdateCollateralMultiplier
    | HandleUpdateCollateralPriceSource;

  export type QueryMsg =
    | QueryConfig
    | QueryCollateralPrice
    | QueryCollateralAssetInfo
    | QueryCollateralAssetInfos;
}

export class MirrorCollateralOracle extends ContractClient {
  public init(
    init_msg: MirrorCollateralOracle.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public updateConfig(
    config: MirrorCollateralOracle.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public registerCollateralAsset(
    asset: AssetInfo,
    price_source: MirrorCollateralOracle.SourceType,
    multiplier: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      register_collateral_asset: {
        asset,
        price_source,
        multiplier: new Dec(multiplier).toFixed()
      }
    });
  }

  public revokeCollateralAsset(asset: AssetInfo): MsgExecuteContract {
    return this.createExecuteMsg({
      revoke_collateral_asset: {
        asset
      }
    });
  }

  public updateCollateralMultiplier(
    asset: AssetInfo,
    multiplier: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_collateral_multiplier: {
        asset,
        multiplier: new Dec(multiplier).toFixed()
      }
    });
  }

  public updateCollateralPriceSource(
    asset: AssetInfo,
    price_source: MirrorCollateralOracle.SourceType
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_collateral_price_source: {
        asset,
        price_source
      }
    });
  }

  public async getConfig(): Promise<MirrorCollateralOracle.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getCollateralPrice(
    asset: string
  ): Promise<MirrorCollateralOracle.CollateralPriceResponse> {
    return this.query({
      collateral_price: { asset }
    });
  }

  public async getCollateralAssetInfo(
    asset: string
  ): Promise<MirrorCollateralOracle.CollateralInfoResponse> {
    return this.query({
      collateral_asset_info: { asset }
    });
  }

  public async getCollateralAssetInfos(): Promise<MirrorCollateralOracle.CollateralInfosResponse> {
    return this.query({
      collateral_asset_infos: {}
    });
  }

  // Typed overloads

  protected async query<T>(
    query_msg: MirrorCollateralOracle.QueryMsg
  ): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    execute_msg: MirrorCollateralOracle.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(execute_msg, coins);
  }
}
