import {
  AccAddress,
  MsgExecuteContract,
  Coins,
  Numeric,
  Int,
  MsgInstantiateContract,
  Dec,
  Coin
} from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { AssetInfo, Asset, Token, isNativeToken } from '../utils/Asset';
import { ContractClient } from './ContractClient';
import { TerraswapToken } from './TerraswapToken';

export namespace MirrorMint {
  export interface InitMsg {
    owner: AccAddress;
    oracle: AccAddress;
    collector: AccAddress;
    collateral_oracle: AccAddress;
    staking: AccAddress;
    terraswap_factory: AccAddress;
    lock: AccAddress;
    base_denom: string;
    token_code_id: number;
    protocol_fee_rate: string;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      oracle?: AccAddress;
      collector?: AccAddress;
      collateral_oracle?: AccAddress;
      staking?: AccAddress;
      terraswap_factory?: AccAddress;
      lock?: AccAddress;
      token_code_id?: number;
      protocol_fee_rate?: string;
    };
  }

  export interface HandleUpdateAsset {
    udpate_asset: {
      asset_token: AccAddress;
      auction_discount?: string;
      min_collateral_ratio?: string;
    };
  }

  export interface HandleRegisterAsset {
    register_asset: {
      asset_token: AccAddress;
      auction_discount: string;
      min_collateral_ratio: string;
      mint_end?: number;
      min_collateral_ratio_after_migration?: string;
    };
  }

  export interface HandleRegisterMigration {
    register_migration: {
      asset_token: AccAddress;
      end_price: string;
    };
  }

  export interface ShortParams {
    short_params: {
      belief_price?: string;
      max_spread?: string;
    };
  }

  export interface HandleOpenPosition {
    open_position: {
      collateral: Asset<AssetInfo>;
      asset_info: AssetInfo;
      collateral_ratio: string;
      short_params?: ShortParams;
    };
  }

  export interface HandleDeposit {
    deposit: {
      position_idx: string;
      collateral: Asset<AssetInfo>;
    };
  }

  export interface HandleWithdraw {
    withdraw: {
      position_idx: string;
      collateral: Asset<AssetInfo>;
    };
  }

  export interface HandleMint {
    mint: {
      position_idx: string;
      asset: Asset<Token>;
      short_params?: ShortParams;
    };
  }

  export interface HookOpenPosition {
    open_position: {
      asset_info: AssetInfo;
      collateral_ratio: string;
      short_params?: ShortParams;
    };
  }

  export interface HookDeposit {
    deposit: {
      position_idx: string;
    };
  }

  export interface HookBurn {
    burn: {
      position_idx: string;
    };
  }

  export interface HookAuction {
    auction: {
      position_idx: string;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryAssetConfig {
    asset_config: {
      asset_token: AccAddress;
    };
  }

  export interface QueryPosition {
    position: {
      position_idx: string;
    };
  }

  export interface QueryPositions {
    positions: {
      owner_addr?: AccAddress;
      asset_token?: AccAddress;
      start_after?: string;
      limit?: number;
    };
  }

  export interface QueryNextPositionIdx {
    next_position_idx: EmptyObject;
  }

  export interface ConfigResponse {
    owner: AccAddress;
    oracle: AccAddress;
    collector: AccAddress;
    collateral_oracle: AccAddress;
    staking: AccAddress;
    terraswap_factory: AccAddress;
    lock: AccAddress;
    base_denom: string;
    token_code_id: number;
    protocol_fee_rate: string;
  }

  export interface AssetConfigResponse {
    token: AccAddress;
    auction_discount: string;
    min_collateral_ratio: string;
    end_price?: string;
    mint_end?: number;
    min_collateral_ratio_after_migration?: string;
  }

  export interface PositionResponse {
    idx: string;
    owner: AccAddress;
    collateral: Asset<AssetInfo>;
    asset: Asset<Token>;
    is_short: boolean;
  }

  export interface PositionsResponse {
    positions: Array<PositionResponse>;
  }

  export interface NextPositionIdxResponse {
    next_position_idx: string;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleUpdateAsset
    | HandleRegisterAsset
    | HandleRegisterMigration
    | HandleOpenPosition
    | HandleDeposit
    | HandleWithdraw
    | HandleMint;

  export type HookMsg = HookAuction | HookBurn | HookDeposit | HookOpenPosition;

  export type QueryMsg =
    | QueryConfig
    | QueryAssetConfig
    | QueryPosition
    | QueryPositions
    | QueryNextPositionIdx;
}

function createHookMsg(msg: MirrorMint.HookMsg): string {
  return Buffer.from(JSON.stringify(msg)).toString('base64');
}

export class MirrorMint extends ContractClient {
  protected getTerraswapToken(contractAddress: AccAddress): TerraswapToken {
    return new TerraswapToken({
      contractAddress: contractAddress,
      lcd: this.lcd,
      key: this.key
    });
  }

  public init(
    init_msg: MirrorMint.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public updateConfig(
    config: MirrorMint.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public updateAsset(
    asset_token: AccAddress,
    auction_discount?: Numeric.Input,
    min_collateral_ratio?: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      udpate_asset: {
        asset_token,
        auction_discount: auction_discount
          ? new Dec(auction_discount).toFixed()
          : undefined,
        min_collateral_ratio: min_collateral_ratio
          ? new Dec(min_collateral_ratio).toFixed()
          : undefined
      }
    });
  }

  public registerAsset(
    asset_token: AccAddress,
    auction_discount: Numeric.Input,
    min_collateral_ratio: Numeric.Input,
    mint_end?: number,
    min_collateral_ratio_after_migration?: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      register_asset: {
        asset_token,
        auction_discount: new Dec(auction_discount).toFixed(),
        min_collateral_ratio: new Dec(min_collateral_ratio).toFixed(),
        mint_end,
        min_collateral_ratio_after_migration: min_collateral_ratio_after_migration
          ? new Dec(min_collateral_ratio_after_migration).toFixed()
          : undefined
      }
    });
  }

  public registerMigration(
    asset_token: AccAddress,
    end_price: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      register_migration: {
        asset_token,
        end_price: new Dec(end_price).toFixed()
      }
    });
  }

  public openPosition(
    collateral: Asset<AssetInfo>,
    asset_info: AssetInfo,
    collateral_ratio: Numeric.Input,
    short_params?: MirrorMint.ShortParams
  ): MsgExecuteContract {
    if (isNativeToken(collateral.info)) {
      return this.createExecuteMsg(
        {
          open_position: {
            collateral,
            asset_info,
            collateral_ratio: new Dec(collateral_ratio).toFixed(),
            short_params
          }
        },
        [new Coin(collateral.info.native_token.denom, collateral.amount)]
      );
    } else {
      if (!this.contractAddress) {
        throw new Error(
          'Mirror Mint contractAddress not provided - needed for openPosition()'
        );
      }

      const collateral_token = this.getTerraswapToken(
        collateral.info.token.contract_addr
      );

      return collateral_token.send(
        this.contractAddress,
        collateral.amount,
        createHookMsg({
          open_position: {
            asset_info,
            collateral_ratio: new Dec(collateral_ratio).toFixed(),
            short_params
          }
        })
      );
    }
  }

  public deposit(
    position_idx: Numeric.Input,
    collateral: Asset<AssetInfo>
  ): MsgExecuteContract {
    if (isNativeToken(collateral.info)) {
      return this.createExecuteMsg(
        {
          deposit: {
            position_idx: new Int(position_idx).toString(),
            collateral
          }
        },
        [new Coin(collateral.info.native_token.denom, collateral.amount)]
      );
    } else {
      if (!this.contractAddress) {
        throw new Error(
          'Mirror Mint contractAddress not provided - needed for deposit()'
        );
      }

      const collateral_token = this.getTerraswapToken(
        collateral.info.token.contract_addr
      );

      return collateral_token.send(
        this.contractAddress,
        collateral.amount,
        createHookMsg({
          deposit: {
            position_idx: new Int(position_idx).toString()
          }
        })
      );
    }
  }

  public withdraw(
    position_idx: Numeric.Input,
    collateral: Asset<AssetInfo>
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      withdraw: {
        position_idx: new Int(position_idx).toString(),
        collateral
      }
    });
  }

  public mint(
    position_idx: Numeric.Input,
    asset: Asset<Token>,
    short_params?: MirrorMint.ShortParams
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      mint: {
        position_idx: new Int(position_idx).toString(),
        asset,
        short_params
      }
    });
  }

  public burn(
    position_idx: Numeric.Input,
    asset: Asset<Token>
  ): MsgExecuteContract {
    if (!this.contractAddress) {
      throw new Error(
        'Mirror Mint contractAddress not provided - needed for burn()'
      );
    }

    const asset_token = this.getTerraswapToken(asset.info.token.contract_addr);

    return asset_token.send(
      this.contractAddress,
      asset.amount,
      createHookMsg({
        burn: {
          position_idx: new Int(position_idx).toString()
        }
      })
    );
  }

  public auction(
    position_idx: Numeric.Input,
    asset: Asset<Token>
  ): MsgExecuteContract {
    if (!this.contractAddress) {
      throw new Error(
        'Mirror Mint contractAddress not provided - needed for auction()'
      );
    }

    const asset_token = this.getTerraswapToken(asset.info.token.contract_addr);

    return asset_token.send(
      this.contractAddress,
      asset.amount,
      createHookMsg({
        auction: {
          position_idx: new Int(position_idx).toString()
        }
      })
    );
  }

  public async getConfig(): Promise<MirrorMint.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getAssetConfig(
    asset_token: AccAddress
  ): Promise<MirrorMint.AssetConfigResponse> {
    return this.query({
      asset_config: {
        asset_token
      }
    });
  }

  public async getPosition(
    position_idx: Numeric.Input
  ): Promise<MirrorMint.PositionResponse> {
    return this.query({
      position: {
        position_idx: new Int(position_idx).toString()
      }
    });
  }

  public async getPositions(
    owner_addr?: AccAddress,
    start_after?: Numeric.Input,
    limit?: number
  ): Promise<MirrorMint.PositionsResponse> {
    return this.query({
      positions: {
        owner_addr: owner_addr ? owner_addr : this.wallet.key.accAddress,
        start_after: start_after ? new Int(start_after).toString() : undefined,
        limit
      }
    });
  }

  public async getNextPositionIdx(): Promise<MirrorMint.NextPositionIdxResponse> {
    return this.query({
      next_position_idx: {}
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorMint.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    execute_msg: MirrorMint.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(execute_msg, coins);
  }
}
