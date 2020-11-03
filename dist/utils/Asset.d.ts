import { AccAddress } from '@terra-money/terra.js';
export interface Token {
    token: {
        contract_addr: AccAddress;
    };
}
export interface NativeToken {
    native_token: {
        denom: string;
    };
}
export declare type AssetInfo = Token | NativeToken;
export declare function isNativeToken(assetInfo: AssetInfo): assetInfo is NativeToken;
export interface Asset {
    info: AssetInfo;
    amount: string;
}
export declare const UST: NativeToken;
