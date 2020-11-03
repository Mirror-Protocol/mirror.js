import { AccAddress, Coins, Numeric, MsgInstantiateContract, MsgExecuteContract } from '@terra-money/terra.js';
import { AssetInfo } from '../utils/Asset';
import { ContractClient } from './ContractClient';
import { EmptyObject } from '../utils/EmptyObject';
export declare namespace MirrorOracle {
    interface InitMsg {
        owner: AccAddress;
        base_asset_info: AssetInfo;
    }
    interface HandleUpdateConfig {
        update_config: {
            owner?: AccAddress;
        };
    }
    interface HandleRegisterAsset {
        register_asset: {
            asset_token: AccAddress;
            feeder: AccAddress;
        };
    }
    interface PriceInfo {
        asset_token: AccAddress;
        price: string;
    }
    interface HandleFeedPrice {
        feed_price: {
            price_infos: Array<PriceInfo>;
        };
    }
    interface QueryConfig {
        config: EmptyObject;
    }
    interface QueryAsset {
        asset: {
            asset_token: AccAddress;
        };
    }
    interface QueryPrice {
        price: {
            asset_token: AccAddress;
        };
    }
    interface QueryPrices {
        prices: EmptyObject;
    }
    interface ConfigResponse {
        owner: AccAddress;
        base_asset_info: AssetInfo;
    }
    interface AssetResponse {
        asset_token: AccAddress;
        feeder: AccAddress;
    }
    interface PriceResponse {
        price: string;
        last_update_time: number;
        asset_token: AccAddress;
    }
    interface PricesResponse {
        prices: Array<PriceResponse>;
    }
    type HandleMsg = HandleUpdateConfig | HandleRegisterAsset | HandleFeedPrice;
    type QueryMsg = QueryConfig | QueryAsset | QueryPrice | QueryPrices;
}
export declare class MirrorOracle extends ContractClient {
    init(init_msg: MirrorOracle.InitMsg, migratable: boolean): MsgInstantiateContract;
    updateConfig(config: MirrorOracle.HandleUpdateConfig['update_config']): MsgExecuteContract;
    registerAsset(asset_token: AccAddress, feeder: AccAddress): MsgExecuteContract;
    feedPrice(price_infos: Array<{
        asset_token: AccAddress;
        price: Numeric.Input;
    }>): MsgExecuteContract;
    getConfig(): Promise<MirrorOracle.ConfigResponse>;
    getAsset(asset_token: AccAddress): Promise<MirrorOracle.AssetResponse>;
    getPrice(asset_token: AccAddress): Promise<MirrorOracle.PriceResponse>;
    getPrices(): Promise<MirrorOracle.PricesResponse>;
    protected query<T>(query_msg: MirrorOracle.QueryMsg): Promise<T>;
    protected createExecuteMsg(execute_msg: MirrorOracle.HandleMsg, coins?: Coins.Input): MsgExecuteContract;
}
