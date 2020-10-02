import { AccAddress, Denom, LCDClient } from '@terra-money/terra.js';

export interface Config {
  distribution_contract: AccAddress;
  uniswap_factory: AccAddress;
  mirror_token: AccAddress;
  base_denom: Denom;
}
