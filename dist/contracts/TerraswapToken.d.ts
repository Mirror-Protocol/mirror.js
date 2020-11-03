import { AccAddress, Coins, Numeric, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js';
import { ContractClient } from './ContractClient';
import { EmptyObject } from '../utils/EmptyObject';
export declare namespace TerraswapToken {
    interface InitHook {
        msg: string;
        contract_addr: AccAddress;
    }
    interface MinterResponse {
        minter: AccAddress;
        cap?: string;
    }
    interface TokenCoin {
        address: AccAddress;
        amount: string;
    }
    interface InitMsg {
        name: string;
        symbol: string;
        decimals: number;
        initial_balances: Array<TokenCoin>;
        mint?: MinterResponse;
        init_hook?: InitHook;
    }
    interface Cw20ReceiveMsg {
        sender: AccAddress;
        amount: string;
        msg?: string;
    }
    interface Receive {
        receive: Cw20ReceiveMsg;
    }
    interface Transfer {
        transfer: {
            recipient: AccAddress;
            amount: string;
        };
    }
    interface Burn {
        burn: {
            amount: string;
        };
    }
    interface Send {
        send: {
            contract: AccAddress;
            amount: string;
            msg?: string;
        };
    }
    interface Mint {
        mint: {
            recipient: AccAddress;
            amount: string;
        };
    }
    interface ExpirationAtHeight {
        at_height: number;
    }
    interface ExpirationAtTime {
        at_time: number;
    }
    interface ExpirationNever {
        never: EmptyObject;
    }
    type Expiration = ExpirationAtHeight | ExpirationAtTime | ExpirationNever;
    interface IncreaseAllowance {
        increase_allowance: {
            spender: AccAddress;
            amount: string;
            expires?: Expiration;
        };
    }
    interface DecreaseAllowance {
        decrease_allowance: {
            spender: AccAddress;
            amount: string;
            expires?: Expiration;
        };
    }
    interface TransferFrom {
        transfer_from: {
            owner: AccAddress;
            recipient: AccAddress;
            amount: string;
        };
    }
    interface SendFrom {
        send_from: {
            owner: AccAddress;
            contract: AccAddress;
            amount: string;
            msg?: string;
        };
    }
    interface BurnFrom {
        burn_from: {
            owner: AccAddress;
            amount: string;
        };
    }
    interface Balance {
        balance: {
            address: AccAddress;
        };
    }
    interface TokenInfo {
        token_info: EmptyObject;
    }
    interface Minter {
        minter: EmptyObject;
    }
    interface Allownace {
        allowance: {
            owner: AccAddress;
            spender: AccAddress;
        };
    }
    interface AllAllowances {
        all_allowances: {
            owner: AccAddress;
            start_after?: AccAddress;
            limit?: number;
        };
    }
    interface AllAccounts {
        all_accounts: {
            start_after?: AccAddress;
            limit?: number;
        };
    }
    interface BalanceResponse {
        balance: string;
    }
    interface TokenInfoResponse {
        name: string;
        symbol: string;
        decimals: number;
        total_supply: string;
    }
    interface AllowanceResponse {
        allowance: string;
        expires: Expiration;
    }
    interface AllowanceInfo {
        spender: AccAddress;
        allowance: string;
        expires: Expiration;
    }
    interface AllAllowancesResponse {
        allowances: Array<AllowanceInfo>;
    }
    interface AllAccountsResponse {
        accounts: Array<AccAddress>;
    }
    type HandleMsg = Receive | Transfer | TransferFrom | Burn | BurnFrom | Send | SendFrom | Mint | IncreaseAllowance | DecreaseAllowance;
    type QueryMsg = Balance | TokenInfo | Minter | Allownace | AllAllowances | AllAccounts;
}
export declare class TerraswapToken extends ContractClient {
    init(init_msg: TerraswapToken.InitMsg, migratable: boolean): MsgInstantiateContract;
    transfer(recipient: AccAddress, amount: Numeric.Input): MsgExecuteContract;
    transferFrom(owner: AccAddress, recipient: AccAddress, amount: Numeric.Input): MsgExecuteContract;
    send(contract: AccAddress, amount: Numeric.Input, msg?: string): MsgExecuteContract;
    sendFrom(owner: AccAddress, contract: AccAddress, amount: Numeric.Input, msg?: any): MsgExecuteContract;
    mint(recipient: AccAddress, amount: Numeric.Input): MsgExecuteContract;
    burn(amount: Numeric.Input): MsgExecuteContract;
    burnFrom(owner: AccAddress, amount: Numeric.Input): MsgExecuteContract;
    increaseAllowance(spender: AccAddress, amount: Numeric.Input, expires?: TerraswapToken.Expiration): MsgExecuteContract;
    decreaseAllowance(spender: AccAddress, amount: Numeric.Input, expires?: TerraswapToken.Expiration): MsgExecuteContract;
    getBalance(address?: AccAddress): Promise<TerraswapToken.BalanceResponse>;
    getTokenInfo(): Promise<TerraswapToken.TokenInfoResponse>;
    getMinter(): Promise<TerraswapToken.MinterResponse>;
    getAllowance(owner: AccAddress, spender: AccAddress): Promise<TerraswapToken.AllowanceResponse>;
    getAllAllowances(owner: AccAddress, start_after?: AccAddress, limit?: number): Promise<TerraswapToken.AllAllowancesResponse>;
    getAllAccounts(start_after?: AccAddress, limit?: number): Promise<TerraswapToken.AllAccountsResponse>;
    protected createExecuteMsg(executeMsg: TerraswapToken.HandleMsg, coins?: Coins.Input): MsgExecuteContract;
    protected query<T>(query_msg: TerraswapToken.QueryMsg): Promise<T>;
}
