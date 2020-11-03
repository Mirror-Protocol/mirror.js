import { AccAddress, MsgExecuteContract, Coins, MsgInstantiateContract, Numeric } from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { AssetInfo } from '../utils/Asset';
import { ContractClient } from './ContractClient';
export declare namespace TerraswapFactory {
    interface InitHook {
        msg: string;
        contract_addr: AccAddress;
    }
    interface InitMsg {
        pair_code_id: number;
        token_code_id: number;
        init_hook?: InitHook;
    }
    interface HandleUpdateConfig {
        update_config: {
            owner?: AccAddress;
            token_code_id?: number;
            pair_code_id?: number;
        };
    }
    interface HandleCreatePair {
        create_pair: {
            pair_owner: AccAddress;
            commission_collector: AccAddress;
            lp_commission: string;
            owner_commission: string;
            asset_infos: [AssetInfo, AssetInfo];
            init_hook?: InitHook;
        };
    }
    interface QueryConfig {
        config: EmptyObject;
    }
    interface QueryPair {
        pair: {
            asset_infos: [AssetInfo, AssetInfo];
        };
    }
    interface ConfigResponse {
        owner: AccAddress;
        pair_code_id: number;
        token_code_id: number;
    }
    interface PairResponse {
        owner: AccAddress;
        contract_addr: AccAddress;
        asset_infos: [AssetInfo, AssetInfo];
    }
    type HandleMsg = HandleUpdateConfig | HandleCreatePair;
    type QueryMsg = QueryConfig | QueryPair;
}
export declare class TerraswapFactory extends ContractClient {
    init(init_msg: TerraswapFactory.InitMsg, migratable: boolean): MsgInstantiateContract;
    updateConfig(config: TerraswapFactory.HandleUpdateConfig['update_config']): MsgExecuteContract;
    createPair(pair_owner: AccAddress, commission_collector: AccAddress, lp_commission: Numeric.Input, owner_commission: Numeric.Input, asset_infos: [AssetInfo, AssetInfo], init_hook?: TerraswapFactory.InitHook): MsgExecuteContract;
    getConfig(): Promise<TerraswapFactory.ConfigResponse>;
    getPair(asset_infos: [AssetInfo, AssetInfo]): Promise<TerraswapFactory.PairResponse>;
    protected query<T>(query_msg: TerraswapFactory.QueryMsg): Promise<T>;
    protected createExecuteMsg(execute_msg: TerraswapFactory.HandleMsg, coins?: Coins.Input): MsgExecuteContract;
}
