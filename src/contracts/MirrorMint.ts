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
import { AssetInfo, Asset, isNativeToken } from '../utils/Asset';
import ContractClient from './ContractClient';
import TerraswapToken from './TerraswapToken';

export namespace MirrorMint {
  export interface InitMsg {
    owner: AccAddress;
    oracle: AccAddress;
    base_asset_info: AssetInfo;
    token_code_id: number;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      token_code_id?: number;
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
    };
  }

  export interface HandleRegisterMigration {
    register_migration: {
      from_token: AccAddress;
      to_token: AccAddress;
      conversion_rate: string;
    };
  }

  export interface HandleOpenPosition {
    open_position: {
      collateral: Asset;
      asset_info: AssetInfo;
      collateral_ratio: string;
    };
  }

  export interface HandleDeposit {
    deposit: {
      position_idx: string;
      collateral: Asset;
    };
  }

  export interface HandleWithdraw {
    withdraw: {
      position_idx: string;
      collateral: Asset;
    };
  }

  export interface HandleMint {
    mint: {
      position_idx: string;
      asset: Asset;
    };
  }

  export interface HandleMigratePosition {
    migrate_position: {
      position_idx: string;
    };
  }

  export interface HookOpenPosition {
    open_position: {
      asset_info: AssetInfo;
      collateral_ratio: string;
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
      owner_addr: AccAddress;
      start_after?: string;
      limit?: number;
    };
  }

  export interface QueryMigration {
    migration: {
      asset_token: AccAddress;
    };
  }

  export interface ConfigResponse {
    owner: AccAddress;
    oracle: AccAddress;
    base_asset_info: AssetInfo;
    token_code_id: number;
  }

  export interface AssetConfigResponse {
    token: AccAddress;
    auction_discount: string;
    min_collateral_ratio: string;
  }

  export interface MigrationResponse {
    from_token: AccAddress;
    to_token: AccAddress;
    conversion_rate: string;
  }

  export interface PositionResponse {
    idx: string;
    owner: AccAddress;
    collateral: Asset;
    asset: Asset;
  }

  export interface PositionsResponse {
    positions: Array<PositionResponse>;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleUpdateAsset
    | HandleRegisterAsset
    | HandleRegisterMigration
    | HandleOpenPosition
    | HandleDeposit
    | HandleWithdraw
    | HandleMint
    | HandleMigratePosition;

  export type HookMsg = HookAuction | HookBurn | HookDeposit | HookOpenPosition;

  export type QueryMsg =
    | QueryConfig
    | QueryAssetConfig
    | QueryPosition
    | QueryPositions
    | QueryMigration;
}

function createHookMsg(msg: MirrorMint.HookMsg): string {
  return Buffer.from(JSON.stringify(msg)).toString('base64');
}

export default class MirrorMint extends ContractClient {
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
    min_collateral_ratio: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      register_asset: {
        asset_token,
        auction_discount: new Dec(auction_discount).toFixed(),
        min_collateral_ratio: new Dec(min_collateral_ratio).toFixed()
      }
    });
  }

  public registerMigration(
    from_token: AccAddress,
    to_token: AccAddress,
    conversion_rate: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      register_migration: {
        from_token,
        to_token,
        conversion_rate: new Dec(conversion_rate).toFixed()
      }
    });
  }

  public openPosition(
    collateral: Asset,
    asset_info: AssetInfo,
    collateral_ratio: Numeric.Input,
    collateral_token?: TerraswapToken
  ): MsgExecuteContract {
    if (!collateral_token) {
      if (!isNativeToken(collateral.info)) {
        throw new Error(
          'CollateralToken must be provided - unable to open position'
        );
      }

      return this.createExecuteMsg(
        {
          open_position: {
            collateral,
            asset_info,
            collateral_ratio: new Dec(collateral_ratio).toFixed()
          }
        },
        [new Coin(collateral.info.native_token.denom, collateral.amount)]
      );
    }

    return collateral_token.send(
      this.contractAddress,
      collateral.amount,
      createHookMsg({
        open_position: {
          asset_info,
          collateral_ratio: new Dec(collateral_ratio).toFixed()
        }
      })
    );
  }

  public deposit(
    position_idx: Numeric.Input,
    collateral: Asset,
    collateral_token?: TerraswapToken
  ): MsgExecuteContract {
    if (!collateral_token) {
      if (!isNativeToken(collateral.info)) {
        throw new Error(
          'CollateralToken must be provided - unable to open position'
        );
      }

      return this.createExecuteMsg(
        {
          deposit: {
            position_idx: new Int(position_idx).toString(),
            collateral
          }
        },
        [new Coin(collateral.info.native_token.denom, collateral.amount)]
      );
    }

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

  public withdraw(
    position_idx: Numeric.Input,
    collateral: Asset
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      withdraw: {
        position_idx: new Int(position_idx).toString(),
        collateral
      }
    });
  }

  public mint(position_idx: Numeric.Input, asset: Asset): MsgExecuteContract {
    return this.createExecuteMsg({
      mint: {
        position_idx: new Int(position_idx).toString(),
        asset
      }
    });
  }

  public burn(
    position_idx: Numeric.Input,
    asset: Asset,
    asset_token: TerraswapToken
  ): MsgExecuteContract {
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
    asset: Asset,
    asset_token: TerraswapToken
  ): MsgExecuteContract {
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

  public migratePosition(position_idx: Numeric.Input): MsgExecuteContract {
    return this.createExecuteMsg({
      migrate_position: {
        position_idx: new Int(position_idx).toString()
      }
    });
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

  public async getMigration(
    asset_token: AccAddress
  ): Promise<MirrorMint.MigrationResponse> {
    return this.query({
      migration: {
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
    owner_addr: AccAddress,
    start_after?: Numeric.Input,
    limit?: number
  ): Promise<MirrorMint.PositionsResponse> {
    return this.query({
      positions: {
        owner_addr,
        start_after: start_after ? new Int(start_after).toString() : undefined,
        limit
      }
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
