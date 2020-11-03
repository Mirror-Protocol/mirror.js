import { AccAddress, Key, LCDClient } from '@terra-money/terra.js';
import { MirrorCollector, MirrorFactory, MirrorGov, MirrorMint, MirrorOracle, MirrorStaking, TerraswapFactory, TerraswapPair, TerraswapToken } from '../contracts/index';
export interface AssetOptions {
    symbol: string;
    name: string;
    token: AccAddress;
    pair: AccAddress;
    lpToken: AccAddress;
}
export interface MirrorOptions {
    lcd: LCDClient;
    key: Key;
    collector: AccAddress;
    factory: AccAddress;
    gov: AccAddress;
    mint: AccAddress;
    oracle: AccAddress;
    staking: AccAddress;
    mirrorToken: AccAddress;
    terraswapFactory: AccAddress;
    assets: Array<AssetOptions>;
}
export declare const DEFAULT_MIRROR_OPTIONS: MirrorOptions;
export declare class Mirror {
    collector: MirrorCollector;
    factory: MirrorFactory;
    gov: MirrorGov;
    mint: MirrorMint;
    oracle: MirrorOracle;
    staking: MirrorStaking;
    mirrorToken: TerraswapToken;
    terraswapFactory: TerraswapFactory;
    assets: Array<{
        name: string;
        symbol: string;
        token: TerraswapToken;
        lpToken: TerraswapToken;
        pair: TerraswapPair;
    }>;
    constructor(options?: Partial<MirrorOptions>);
}
