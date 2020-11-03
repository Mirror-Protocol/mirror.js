import { AccAddress, Coins, Key, LCDClient, MsgExecuteContract, Wallet, MsgInstantiateContract } from '@terra-money/terra.js';
export declare class ContractClient {
    contractAddress?: AccAddress;
    codeID?: number;
    lcd?: LCDClient;
    key: Key;
    constructor(options: Partial<{
        contractAddress: AccAddress;
        codeID: number;
        lcd: LCDClient;
        key: Key;
    }>);
    get wallet(): Wallet;
    protected query<T>(queryMmsg: any): Promise<T>;
    protected createExecuteMsg(executeMsg: any, coins?: Coins.Input): MsgExecuteContract;
    protected createInstantiateMsg(initMsg: any, initCoins: string | Coins.DataDict | import("@terra-money/terra.js").Coin[] | Coins | undefined, migratable: boolean): MsgInstantiateContract;
}
