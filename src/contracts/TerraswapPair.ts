import {
  AccAddress,
  MsgExecuteContract,
  Coins,
  MsgInstantiateContract,
  Coin,
  Numeric,
  Dec
} from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { AssetInfo, Asset, isNativeToken } from '../utils/Asset';
import ContractClient from './ContractClient';
import TerraswapToken from './TerraswapToken';

export namespace TerraswapPair {
  export interface InitHook {
    msg: string;
    contract_addr: AccAddress;
  }

  export interface InitMsg {
    owner: AccAddress;
    commission_collector: AccAddress;
    asset_infos: [AssetInfo, AssetInfo];
    lp_commission: string;
    owner_commission: string;
    token_code_id: number;
    init_hook?: InitHook;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      lp_commission?: string;
      owner_commission?: string;
    };
  }

  export interface HandleProvideLiquidity {
    provide_liqudity: {
      assets: [Asset, Asset];
    };
  }

  export interface HandleSwap {
    swap: {
      offer_asset: Asset;
      belief_price?: string;
      max_spread?: string;
    };
  }

  export interface HookSwap {
    swap: {
      belief_price?: string;
      max_spread?: string;
    };
  }

  export interface HookWithdrawLiquidity {
    withdraw_liquidity: EmptyObject;
  }

  export interface QueryConfigGeneral {
    config_general: EmptyObject;
  }

  export interface QueryConfigAsset {
    config_asset: EmptyObject;
  }

  export interface QueryConfigSwap {
    config_swap: EmptyObject;
  }

  export interface QueryPool {
    pool: EmptyObject;
  }

  export interface QuerySimulation {
    simulation: {
      offer_asset: Asset;
    };
  }

  export interface QueryReverseSimulation {
    reverse_simulation: {
      ask_asset: Asset;
    };
  }

  export interface ConfigGeneralResponse {
    owner: AccAddress;
    liquidity_token: AccAddress;
    commission_collector: AccAddress;
  }

  export interface ConfigSwapResponse {
    lp_commission: string;
    owner_commission: string;
  }

  export interface ConfigAssetResponse {
    infos: [AssetInfo, AssetInfo];
  }

  export interface PoolResponse {
    assets: [Asset, Asset];
    total_share: string;
  }

  export interface SimulationResponse {
    return_amount: string;
    spread_amount: string;
    commission_amount: string;
  }

  export interface ReverseSimulationResponse {
    offer_amount: string;
    spread_amount: string;
    commission_amount: string;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleProvideLiquidity
    | HandleSwap;

  export type HookMsg = HookSwap | HookWithdrawLiquidity;

  export type QueryMsg =
    | QueryConfigGeneral
    | QueryConfigAsset
    | QueryConfigSwap
    | QueryPool
    | QuerySimulation
    | QueryReverseSimulation;
}

function createHookMsg(msg: TerraswapPair.HookMsg): string {
  return Buffer.from(JSON.stringify(msg)).toString('base64');
}

export default class TerraswapPair extends ContractClient {
  public init(
    init_msg: TerraswapPair.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public updateConfig(
    config: TerraswapPair.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  /// CONTRACT - If providing asset is not native token,
  /// must increase allowance first before using it
  public provideLiquidity(assets: [Asset, Asset]): MsgExecuteContract {
    let coins: Coins = new Coins([]);
    assets.forEach((asset) => {
      if (isNativeToken(asset.info)) {
        coins = coins.add(
          new Coin(asset.info.native_token.denom, asset.amount)
        );
      }
    });

    return this.createExecuteMsg(
      {
        provide_liqudity: {
          assets
        }
      },
      coins
    );
  }

  public swap(
    offer_asset: Asset,
    belief_price?: Numeric.Input,
    max_spread?: Numeric.Input,
    offer_token?: TerraswapToken
  ): MsgExecuteContract {
    if (!offer_token) {
      if (!isNativeToken(offer_asset.info)) {
        throw new Error('OfferToken must be provided - unable to swap');
      }

      return this.createExecuteMsg(
        {
          swap: {
            offer_asset,
            belief_price: belief_price
              ? new Dec(belief_price).toString()
              : undefined,
            max_spread: max_spread ? new Dec(max_spread).toString() : undefined
          }
        },
        [new Coin(offer_asset.info.native_token.denom, offer_asset.amount)]
      );
    }

    return offer_token.send(
      this.contractAddress,
      offer_asset.amount,
      createHookMsg({
        swap: {
          belief_price: belief_price
            ? new Dec(belief_price).toString()
            : undefined,
          max_spread: max_spread ? new Dec(max_spread).toString() : undefined
        }
      })
    );
  }

  public withdrawLiquidity(
    amount: Numeric.Input,
    lp_token: TerraswapToken
  ): MsgExecuteContract {
    return lp_token.send(
      this.contractAddress,
      amount,
      createHookMsg({
        withdraw_liquidity: {}
      })
    );
  }

  public async getConfigGeneral(): Promise<
    TerraswapPair.ConfigGeneralResponse
  > {
    return this.query({
      config_general: {}
    });
  }

  public async getConfigAsset(): Promise<TerraswapPair.ConfigAssetResponse> {
    return this.query({
      config_asset: {}
    });
  }

  public async getConfigSwap(): Promise<TerraswapPair.ConfigSwapResponse> {
    return this.query({
      config_swap: {}
    });
  }

  public async getPool(): Promise<TerraswapPair.PoolResponse> {
    return this.query({
      pool: {}
    });
  }

  public async getSimulation(
    offer_asset: Asset
  ): Promise<TerraswapPair.SimulationResponse> {
    return this.query({
      simulation: {
        offer_asset
      }
    });
  }

  public async getReverseSimulation(
    ask_asset: Asset
  ): Promise<TerraswapPair.ReverseSimulationResponse> {
    return this.query({
      reverse_simulation: {
        ask_asset
      }
    });
  }

  protected async query<T>(query_msg: TerraswapPair.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    execute_msg: TerraswapPair.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(execute_msg, coins);
  }
}
