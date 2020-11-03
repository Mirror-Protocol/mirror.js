import { AccAddress, Coins, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { ContractClient } from './ContractClient';
export declare namespace MirrorCollector {
    interface InitMsg {
        distribution_contract: AccAddress;
        terraswap_factory: AccAddress;
        mirror_token: AccAddress;
        base_denom: string;
    }
    interface HandleConvert {
        convert: {
            asset_token: AccAddress;
        };
    }
    interface HandleSend {
        send: EmptyObject;
    }
    interface QueryConfig {
        config: EmptyObject;
    }
    interface ConfigResponse {
        distribution_contract: AccAddress;
        terraswap_factory: AccAddress;
        mirror_token: AccAddress;
        base_denom: string;
    }
    type HandleMsg = HandleConvert | HandleSend;
    type QueryMsg = QueryConfig;
}
export declare class MirrorCollector extends ContractClient {
    init(init_msg: MirrorCollector.InitMsg, migratable: boolean): MsgInstantiateContract;
    convert(asset_token: AccAddress): MsgExecuteContract;
    send(): MsgExecuteContract;
    getConfig(): Promise<MirrorCollector.ConfigResponse>;
    protected query<T>(query_msg: MirrorCollector.QueryMsg): Promise<T>;
    protected createExecuteMsg(executeMsg: MirrorCollector.HandleMsg, coins?: Coins.Input): MsgExecuteContract;
}
