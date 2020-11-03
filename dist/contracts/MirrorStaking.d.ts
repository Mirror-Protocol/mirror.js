import { AccAddress, Coins, Numeric, MsgInstantiateContract, MsgExecuteContract } from '@terra-money/terra.js';
import { ContractClient } from './ContractClient';
import { EmptyObject } from '../utils/EmptyObject';
import { TerraswapToken } from './TerraswapToken';
export declare namespace MirrorStaking {
    interface InitMsg {
        owner: AccAddress;
        mirror_token: AccAddress;
    }
    interface HandleUpdateConfig {
        update_config: {
            asset_token?: AccAddress;
            staking_token?: AccAddress;
        };
    }
    interface HandleRegisterAsset {
        register_asset: {
            asset_token: AccAddress;
            staking_token: AccAddress;
        };
    }
    interface HandleUnbond {
        unbond: {
            asset_token: AccAddress;
            amount: string;
        };
    }
    interface HandleWithdraw {
        withdraw: {
            asset_token?: AccAddress;
        };
    }
    interface HookBond {
        bond: {
            asset_token: AccAddress;
        };
    }
    interface HookDepositReward {
        deposit_reward: {
            asset_token: AccAddress;
        };
    }
    interface QueryConfig {
        config: EmptyObject;
    }
    interface QueryPoolInfo {
        pool_info: {
            asset_token: AccAddress;
        };
    }
    interface QueryRewardInfo {
        reward_info: {
            staker: AccAddress;
            asset_token?: AccAddress;
        };
    }
    interface ConfigResponse {
        owner: AccAddress;
        mirror_token: AccAddress;
    }
    interface PoolInfoResponse {
        asset_token: AccAddress;
        staking_token: AccAddress;
        total_bond_amount: string;
        reward_index: string;
    }
    interface RewardInfoResponseItem {
        asset_token: AccAddress;
        index: string;
        bond_amount: string;
        pending_reward: string;
    }
    interface RewardInfoResponse {
        staker: AccAddress;
        reward_infos: Array<RewardInfoResponseItem>;
    }
    type HandleMsg = HandleUpdateConfig | HandleRegisterAsset | HandleUnbond | HandleWithdraw;
    type HookMsg = HookBond | HookDepositReward;
    type QueryMsg = QueryConfig | QueryPoolInfo | QueryRewardInfo;
}
export declare class MirrorStaking extends ContractClient {
    init(init_msg: MirrorStaking.InitMsg, migratable: boolean): MsgInstantiateContract;
    updateConfig(config: MirrorStaking.HandleUpdateConfig['update_config']): MsgExecuteContract;
    registerAsset(asset_token: AccAddress, staking_token: AccAddress): MsgExecuteContract;
    unbond(asset_token: AccAddress, amount: Numeric.Input): MsgExecuteContract;
    withdraw(asset_token?: AccAddress): MsgExecuteContract;
    bond(asset_token: AccAddress, amount: Numeric.Input, lp_token: TerraswapToken): MsgExecuteContract;
    depositReward(asset_token: AccAddress, amount: Numeric.Input, mirror_token: TerraswapToken): MsgExecuteContract;
    getConfig(): Promise<MirrorStaking.ConfigResponse>;
    getPoolInfo(asset_token: AccAddress): Promise<MirrorStaking.PoolInfoResponse>;
    getRewardInfo(staker: AccAddress, asset_token?: AccAddress): Promise<MirrorStaking.RewardInfoResponse>;
    protected query<T>(query_msg: MirrorStaking.QueryMsg): Promise<T>;
    protected createExecuteMsg(execute_msg: MirrorStaking.HandleMsg, coins?: Coins.Input): MsgExecuteContract;
}
