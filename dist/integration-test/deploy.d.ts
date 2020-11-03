import { AccAddress } from '@terra-money/terra.js';
export declare function deployContracts(): Promise<{
    gov: AccAddress;
    factory: AccAddress;
    terraswapFactory: AccAddress;
    staking: AccAddress;
    oracle: AccAddress;
    mint: AccAddress;
    collector: AccAddress;
    mirrorToken: AccAddress;
    mirrorLpToken: AccAddress;
    mirrorPair: AccAddress;
    appleToken: AccAddress;
    applePair: AccAddress;
    appleLpToken: AccAddress;
}>;
