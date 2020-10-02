import { AccAddress } from '@terra-money/terra.js';
import {
  MirrorCollector,
  MirrorFactory,
  MirrorGov,
  MirrorMint,
  MirrorOracle,
  MirrorStaking,
} from '../contracts';

export interface MirrorOptions {
  contracts: {
    mirror_collector: AccAddress;
    mirror_factory: AccAddress;
    mirror_gov: AccAddress;
    mirror_mint: AccAddress;
    mirror_oracle: AccAddress;
    mirror_staking: AccAddress;
  };
}

export class Mirror {
  public collector: MirrorCollector;
  public factory: MirrorFactory;
  public gov: MirrorGov;
  public mint: MirrorMint;
  public oracle: MirrorOracle;
  public staking: MirrorStaking;

  constructor(options: MirrorOptions) {
    this.collector = new MirrorCollector();
    this.factory = new MirrorFactory();
    this.gov = new MirrorGov();
    this.mint = new MirrorMint();
    this.oracle = new MirrorOracle();
    this.staking = new MirrorStaking();
  }
}
