import { AccAddress, MsgExecuteContract, Coins, Numeric, MsgInstantiateContract } from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { AssetInfo, Asset } from '../utils/Asset';
import { ContractClient } from './ContractClient';
import { TerraswapToken } from './TerraswapToken';
export declare namespace MirrorMint {
    interface InitMsg {
        owner: AccAddress;
        oracle: AccAddress;
        base_asset_info: AssetInfo;
        token_code_id: number;
    }
    interface HandleUpdateConfig {
        update_config: {
            owner?: AccAddress;
            token_code_id?: number;
        };
    }
    interface HandleUpdateAsset {
        udpate_asset: {
            asset_token: AccAddress;
            auction_discount?: string;
            min_collateral_ratio?: string;
        };
    }
    interface HandleRegisterAsset {
        register_asset: {
            asset_token: AccAddress;
            auction_discount: string;
            min_collateral_ratio: string;
        };
    }
    interface HandleRegisterMigration {
        register_migration: {
            asset_token: AccAddress;
            end_price: string;
        };
    }
    interface HandleOpenPosition {
        open_position: {
            collateral: Asset;
            asset_info: AssetInfo;
            collateral_ratio: string;
        };
    }
    interface HandleDeposit {
        deposit: {
            position_idx: string;
            collateral: Asset;
        };
    }
    interface HandleWithdraw {
        withdraw: {
            position_idx: string;
            collateral: Asset;
        };
    }
    interface HandleMint {
        mint: {
            position_idx: string;
            asset: Asset;
        };
    }
    interface HookOpenPosition {
        open_position: {
            asset_info: AssetInfo;
            collateral_ratio: string;
        };
    }
    interface HookDeposit {
        deposit: {
            position_idx: string;
        };
    }
    interface HookBurn {
        burn: {
            position_idx: string;
        };
    }
    interface HookAuction {
        auction: {
            position_idx: string;
        };
    }
    interface QueryConfig {
        config: EmptyObject;
    }
    interface QueryAssetConfig {
        asset_config: {
            asset_token: AccAddress;
        };
    }
    interface QueryPosition {
        position: {
            position_idx: string;
        };
    }
    interface QueryPositions {
        positions: {
            owner_addr: AccAddress;
            start_after?: string;
            limit?: number;
        };
    }
    interface ConfigResponse {
        owner: AccAddress;
        oracle: AccAddress;
        base_asset_info: AssetInfo;
        token_code_id: number;
    }
    interface AssetConfigResponse {
        token: AccAddress;
        auction_discount: string;
        min_collateral_ratio: string;
        end_price?: string;
    }
    interface PositionResponse {
        idx: string;
        owner: AccAddress;
        collateral: Asset;
        asset: Asset;
    }
    interface PositionsResponse {
        positions: Array<PositionResponse>;
    }
    type HandleMsg = HandleUpdateConfig | HandleUpdateAsset | HandleRegisterAsset | HandleRegisterMigration | HandleOpenPosition | HandleDeposit | HandleWithdraw | HandleMint;
    type HookMsg = HookAuction | HookBurn | HookDeposit | HookOpenPosition;
    type QueryMsg = QueryConfig | QueryAssetConfig | QueryPosition | QueryPositions;
}
export declare class MirrorMint extends ContractClient {
    init(init_msg: MirrorMint.InitMsg, migratable: boolean): MsgInstantiateContract;
    updateConfig(config: MirrorMint.HandleUpdateConfig['update_config']): MsgExecuteContract;
    updateAsset(asset_token: AccAddress, auction_discount?: Numeric.Input, min_collateral_ratio?: Numeric.Input): MsgExecuteContract;
    registerAsset(asset_token: AccAddress, auction_discount: Numeric.Input, min_collateral_ratio: Numeric.Input): MsgExecuteContract;
    registerMigration(asset_token: AccAddress, end_price: Numeric.Input): MsgExecuteContract;
    openPosition(collateral: Asset, asset_info: AssetInfo, collateral_ratio: Numeric.Input, collateral_token?: TerraswapToken): MsgExecuteContract;
    deposit(position_idx: Numeric.Input, collateral: Asset, collateral_token?: TerraswapToken): MsgExecuteContract;
    withdraw(position_idx: Numeric.Input, collateral: Asset): MsgExecuteContract;
    mint(position_idx: Numeric.Input, asset: Asset): MsgExecuteContract;
    burn(position_idx: Numeric.Input, asset: Asset, asset_token: TerraswapToken): MsgExecuteContract;
    auction(position_idx: Numeric.Input, asset: Asset, asset_token: TerraswapToken): MsgExecuteContract;
    getConfig(): Promise<MirrorMint.ConfigResponse>;
    getAssetConfig(asset_token: AccAddress): Promise<MirrorMint.AssetConfigResponse>;
    getPosition(position_idx: Numeric.Input): Promise<MirrorMint.PositionResponse>;
    getPositions(owner_addr?: AccAddress, start_after?: Numeric.Input, limit?: number): Promise<MirrorMint.PositionsResponse>;
    protected query<T>(query_msg: MirrorMint.QueryMsg): Promise<T>;
    protected createExecuteMsg(execute_msg: MirrorMint.HandleMsg, coins?: Coins.Input): MsgExecuteContract;
}
