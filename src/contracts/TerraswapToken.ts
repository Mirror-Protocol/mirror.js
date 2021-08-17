import {
  AccAddress,
  Coins,
  Numeric,
  MsgExecuteContract,
  MsgInstantiateContract,
  Int
} from '@terra-money/terra.js';
import { ContractClient } from './ContractClient';
import { EmptyObject } from '../utils/EmptyObject';

export namespace TerraswapToken {
  export interface InitHook {
    msg: string;
    contract_addr: AccAddress;
  }

  export interface MinterResponse {
    minter: AccAddress;
    cap?: string;
  }

  export interface TokenCoin {
    address: AccAddress;
    amount: string;
  }

  export interface InitMsg {
    name: string;
    symbol: string;
    decimals: number;
    initial_balances: Array<TokenCoin>;
    mint?: MinterResponse;
    init_hook?: InitHook;
  }

  export interface Cw20ReceiveMsg {
    sender: AccAddress;
    amount: string;
    msg?: string;
  }

  export interface Receive {
    receive: Cw20ReceiveMsg;
  }

  export interface Transfer {
    transfer: {
      recipient: AccAddress;
      amount: string;
    };
  }

  export interface Burn {
    burn: {
      amount: string;
    };
  }

  export interface Send {
    send: {
      contract: AccAddress;
      amount: string;
      msg?: string;
    };
  }

  export interface Mint {
    mint: {
      recipient: AccAddress;
      amount: string;
    };
  }

  export interface ExpirationAtHeight {
    at_height: number;
  }

  export interface ExpirationAtTime {
    at_time: number;
  }

  export interface ExpirationNever {
    never: EmptyObject;
  }

  export type Expiration =
    | ExpirationAtHeight
    | ExpirationAtTime
    | ExpirationNever;

  export interface IncreaseAllowance {
    increase_allowance: {
      spender: AccAddress;
      amount: string;
      expires?: Expiration;
    };
  }

  export interface DecreaseAllowance {
    decrease_allowance: {
      spender: AccAddress;
      amount: string;
      expires?: Expiration;
    };
  }

  export interface TransferFrom {
    transfer_from: {
      owner: AccAddress;
      recipient: AccAddress;
      amount: string;
    };
  }

  export interface SendFrom {
    send_from: {
      owner: AccAddress;
      contract: AccAddress;
      amount: string;
      msg?: string;
    };
  }

  export interface BurnFrom {
    burn_from: {
      owner: AccAddress;
      amount: string;
    };
  }

  export interface Balance {
    balance: {
      address: AccAddress;
    };
  }

  export interface TokenInfo {
    token_info: EmptyObject;
  }

  export interface Minter {
    minter: EmptyObject;
  }

  export interface Allownace {
    allowance: {
      owner: AccAddress;
      spender: AccAddress;
    };
  }

  export interface AllAllowances {
    all_allowances: {
      owner: AccAddress;
      start_after?: AccAddress;
      limit?: number;
    };
  }

  export interface AllAccounts {
    all_accounts: {
      start_after?: AccAddress;
      limit?: number;
    };
  }

  export interface BalanceResponse {
    balance: string;
  }

  export interface TokenInfoResponse {
    name: string;
    symbol: string;
    decimals: number;
    total_supply: string;
  }

  export interface AllowanceResponse {
    allowance: string;
    expires: Expiration;
  }

  export interface AllowanceInfo {
    spender: AccAddress;
    allowance: string;
    expires: Expiration;
  }

  export interface AllAllowancesResponse {
    allowances: Array<AllowanceInfo>;
  }

  export interface AllAccountsResponse {
    accounts: Array<AccAddress>;
  }

  export type HandleMsg =
    | Receive
    | Transfer
    | TransferFrom
    | Burn
    | BurnFrom
    | Send
    | SendFrom
    | Mint
    | IncreaseAllowance
    | DecreaseAllowance;

  export type QueryMsg =
    | Balance
    | TokenInfo
    | Minter
    | Allownace
    | AllAllowances
    | AllAccounts;
}

export class TerraswapToken extends ContractClient {
  public init(init_msg: TerraswapToken.InitMsg): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {});
  }

  public transfer(
    recipient: AccAddress,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      transfer: {
        recipient,
        amount: new Int(amount).toString()
      }
    });
  }

  public transferFrom(
    owner: AccAddress,
    recipient: AccAddress,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      transfer_from: {
        owner,
        recipient,
        amount: new Int(amount).toString()
      }
    });
  }

  public send(
    contract: AccAddress,
    amount: Numeric.Input,
    msg?: string
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      send: {
        contract,
        amount: new Int(amount).toString(),
        msg
      }
    });
  }

  public sendFrom(
    owner: AccAddress,
    contract: AccAddress,
    amount: Numeric.Input,
    msg?: any
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      send_from: {
        owner,
        contract,
        amount: new Int(amount).toString(),
        msg: msg
          ? Buffer.from(JSON.stringify(msg)).toString('base64')
          : undefined
      }
    });
  }

  public mint(
    recipient: AccAddress,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      mint: {
        recipient,
        amount: new Int(amount).toString()
      }
    });
  }

  public burn(amount: Numeric.Input): MsgExecuteContract {
    return this.createExecuteMsg({
      burn: {
        amount: new Int(amount).toString()
      }
    });
  }

  public burnFrom(
    owner: AccAddress,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      burn_from: {
        owner,
        amount: new Int(amount).toString()
      }
    });
  }

  public increaseAllowance(
    spender: AccAddress,
    amount: Numeric.Input,
    expires?: TerraswapToken.Expiration
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      increase_allowance: {
        spender,
        amount: new Int(amount).toString(),
        expires
      }
    });
  }

  public decreaseAllowance(
    spender: AccAddress,
    amount: Numeric.Input,
    expires?: TerraswapToken.Expiration
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      decrease_allowance: {
        spender,
        amount: new Int(amount).toString(),
        expires
      }
    });
  }

  public async getBalance(
    address?: AccAddress
  ): Promise<TerraswapToken.BalanceResponse> {
    return this.query({
      balance: {
        address: address ? address : this.wallet.key.accAddress
      }
    });
  }

  public async getTokenInfo(): Promise<TerraswapToken.TokenInfoResponse> {
    return this.query({
      token_info: {}
    });
  }

  public async getMinter(): Promise<TerraswapToken.MinterResponse> {
    return this.query({
      minter: {}
    });
  }

  public async getAllowance(
    owner: AccAddress,
    spender: AccAddress
  ): Promise<TerraswapToken.AllowanceResponse> {
    return this.query({
      allowance: {
        owner,
        spender
      }
    });
  }

  public async getAllAllowances(
    owner: AccAddress,
    start_after?: AccAddress,
    limit?: number
  ): Promise<TerraswapToken.AllAllowancesResponse> {
    return this.query({
      all_allowances: {
        owner,
        start_after,
        limit
      }
    });
  }

  public async getAllAccounts(
    start_after?: AccAddress,
    limit?: number
  ): Promise<TerraswapToken.AllAccountsResponse> {
    return this.query({
      all_accounts: {
        start_after,
        limit
      }
    });
  }

  protected createExecuteMsg(
    executeMsg: TerraswapToken.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(executeMsg, coins);
  }

  protected async query<T>(query_msg: TerraswapToken.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }
}
