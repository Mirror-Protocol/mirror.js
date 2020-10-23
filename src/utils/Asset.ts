/* eslint-disable camelcase */
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

export type AssetInfo = Token | NativeToken;

export function isNativeToken(assetInfo: AssetInfo): assetInfo is NativeToken {
  return 'denom' in assetInfo;
}

export interface Asset {
  info: AssetInfo;
  amount: string;
}
