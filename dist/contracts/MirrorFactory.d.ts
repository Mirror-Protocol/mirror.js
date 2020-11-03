import { AccAddress, Coins, Dec, Numeric, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { ContractClient } from './ContractClient';
export declare namespace MirrorFactory {
    interface InitMsg {
        mint_per_block: string;
        token_code_id: number;
        base_denom: string;
    }
    interface Params {
        weight: string;
        lp_commission: string;
        owner_commission: string;
        auction_discount: string;
        min_collateral_ratio: string;
    }
    interface HandlePostInitialize {
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
    interface HandleUpdateConfig {
        update_config: {
            owner?: AccAddress;
            mint_per_block?: string;
            token_code_id?: number;
        };
    }
    interface HandleUpdateWeight {
        update_weight: {
            asset_token: AccAddress;
            weight: string;
        };
    }
    interface HandleTerraswapCreationHook {
        terraswap_creation_hook: {
            asset_token: AccAddress;
        };
    }
    interface HandleWhitelist {
        whitelist: {
            name: string;
            symbol: string;
            oracle_feeder: AccAddress;
            params: Params;
        };
    }
    interface HandlePassCommand {
        pass_command: {
            contract_addr: AccAddress;
            msg: string;
        };
    }
    interface HandleMint {
        mint: {
            asset_token: AccAddress;
        };
    }
    interface HandleMigrateAsset {
        migrate_asset: {
            name: string;
            symbol: string;
            from_token: AccAddress;
            end_price: string;
        };
    }
    interface QueryConfig {
        config: EmptyObject;
    }
    interface QueryDistributionInfo {
        distribution_info: {
            asset_token: AccAddress;
        };
    }
    interface ConfigResponse {
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
    interface DistributionInfoResponse {
        weight: string;
        last_height: number;
    }
    type HandleMsg = HandlePostInitialize | HandleUpdateWeight | HandleUpdateConfig | HandleTerraswapCreationHook | HandleWhitelist | HandlePassCommand | HandleMint | HandleMigrateAsset;
    type QueryMsg = QueryConfig | QueryDistributionInfo;
}
export declare class MirrorFactory extends ContractClient {
    init(init_msg: MirrorFactory.InitMsg, migratable: boolean): MsgInstantiateContract;
    postInitialize(owner: AccAddress, terraswap_factory: AccAddress, mirror_token: AccAddress, staking_contract: AccAddress, oracle_contract: AccAddress, mint_contract: AccAddress, commission_collector: AccAddress): MsgExecuteContract;
    updateWeight(asset_token: AccAddress, weight: Dec): MsgExecuteContract;
    updateConfig(config: MirrorFactory.HandleUpdateConfig['update_config']): MsgExecuteContract;
    terraswapCreationHook(asset_token: AccAddress): MsgExecuteContract;
    whitelist(name: string, symbol: string, oracle_feeder: AccAddress, params: {
        weight: Numeric.Input;
        lp_commission: Numeric.Input;
        owner_commission: Numeric.Input;
        auction_discount: Numeric.Input;
        min_collateral_ratio: Numeric.Input;
    }): MsgExecuteContract;
    migrateAsset(name: string, symbol: string, from_token: AccAddress, end_price: Numeric.Input): MsgExecuteContract;
    passCommand(contract_addr: AccAddress, msg: any): MsgExecuteContract;
    mint(asset_token: AccAddress): MsgExecuteContract;
    getConfig(): Promise<MirrorFactory.ConfigResponse>;
    getDistributionInfo(asset_token: AccAddress): Promise<MirrorFactory.DistributionInfoResponse>;
    protected query<T>(query_msg: MirrorFactory.QueryMsg): Promise<T>;
    protected createExecuteMsg(executeMsg: MirrorFactory.HandleMsg, coins?: Coins.Input): MsgExecuteContract;
}
