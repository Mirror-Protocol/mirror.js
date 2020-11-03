import { AccAddress, MsgExecuteContract, Coins, MsgInstantiateContract, Numeric } from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { AssetInfo, Asset } from '../utils/Asset';
import { ContractClient } from './ContractClient';
import { TerraswapToken } from './TerraswapToken';
export declare namespace TerraswapPair {
    interface InitHook {
        msg: string;
        contract_addr: AccAddress;
    }
    interface InitMsg {
        owner: AccAddress;
        commission_collector: AccAddress;
        asset_infos: [AssetInfo, AssetInfo];
        lp_commission: string;
        owner_commission: string;
        token_code_id: number;
        init_hook?: InitHook;
    }
    interface HandleUpdateConfig {
        update_config: {
            owner?: AccAddress;
            lp_commission?: string;
            owner_commission?: string;
        };
    }
    interface HandleProvideLiquidity {
        provide_liquidity: {
            assets: [Asset, Asset];
        };
    }
    interface HandleSwap {
        swap: {
            offer_asset: Asset;
            belief_price?: string;
            max_spread?: string;
        };
    }
    interface HookSwap {
        swap: {
            belief_price?: string;
            max_spread?: string;
        };
    }
    interface HookWithdrawLiquidity {
        withdraw_liquidity: EmptyObject;
    }
    interface QueryConfigGeneral {
        config_general: EmptyObject;
    }
    interface QueryConfigAsset {
        config_asset: EmptyObject;
    }
    interface QueryConfigSwap {
        config_swap: EmptyObject;
    }
    interface QueryPool {
        pool: EmptyObject;
    }
    interface QuerySimulation {
        simulation: {
            offer_asset: Asset;
        };
    }
    interface QueryReverseSimulation {
        reverse_simulation: {
            ask_asset: Asset;
        };
    }
    interface ConfigGeneralResponse {
        owner: AccAddress;
        liquidity_token: AccAddress;
        commission_collector: AccAddress;
    }
    interface ConfigSwapResponse {
        lp_commission: string;
        owner_commission: string;
    }
    interface ConfigAssetResponse {
        infos: [AssetInfo, AssetInfo];
    }
    interface PoolResponse {
        assets: [Asset, Asset];
        total_share: string;
    }
    interface SimulationResponse {
        return_amount: string;
        spread_amount: string;
        commission_amount: string;
    }
    interface ReverseSimulationResponse {
        offer_amount: string;
        spread_amount: string;
        commission_amount: string;
    }
    type HandleMsg = HandleUpdateConfig | HandleProvideLiquidity | HandleSwap;
    type HookMsg = HookSwap | HookWithdrawLiquidity;
    type QueryMsg = QueryConfigGeneral | QueryConfigAsset | QueryConfigSwap | QueryPool | QuerySimulation | QueryReverseSimulation;
}
export declare class TerraswapPair extends ContractClient {
    init(init_msg: TerraswapPair.InitMsg, migratable: boolean): MsgInstantiateContract;
    updateConfig(config: TerraswapPair.HandleUpdateConfig['update_config']): MsgExecuteContract;
    provideLiquidity(assets: [Asset, Asset]): MsgExecuteContract;
    swap(offer_asset: Asset, belief_price?: Numeric.Input, max_spread?: Numeric.Input, offer_token?: TerraswapToken): MsgExecuteContract;
    withdrawLiquidity(amount: Numeric.Input, lp_token: TerraswapToken): MsgExecuteContract;
    getConfigGeneral(): Promise<TerraswapPair.ConfigGeneralResponse>;
    getConfigAsset(): Promise<TerraswapPair.ConfigAssetResponse>;
    getConfigSwap(): Promise<TerraswapPair.ConfigSwapResponse>;
    getPool(): Promise<TerraswapPair.PoolResponse>;
    getSimulation(offer_asset: Asset): Promise<TerraswapPair.SimulationResponse>;
    getReverseSimulation(ask_asset: Asset): Promise<TerraswapPair.ReverseSimulationResponse>;
    protected query<T>(query_msg: TerraswapPair.QueryMsg): Promise<T>;
    protected createExecuteMsg(execute_msg: TerraswapPair.HandleMsg, coins?: Coins.Input): MsgExecuteContract;
}
