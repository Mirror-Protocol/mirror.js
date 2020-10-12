import { AccAddress, Key, LCDClient } from '@terra-money/terra.js';
import {
  MirrorCollector,
  MirrorFactory,
  MirrorGov,
  MirrorMint,
  MirrorOracle,
  MirrorStaking,
} from '../contracts';

export interface MirrorOptions {
  lcd: LCDClient;
  key: Key;
  collector: AccAddress;
  factory: AccAddress;
  gov: AccAddress;
  mint: AccAddress;
  oracle: AccAddress;
  staking: AccAddress;
}

export const DEFAULT_MIRROR_OPTIONS = {
  collector: 'terra1...',
  factory: 'terra1...',
  gov: 'terra1...',
  mint: 'terra1...',
  oracle: 'terra1...',
  staking: 'terra1...',
};

export class Mirror {
  public collector: MirrorCollector;
  public factory: MirrorFactory;
  public gov: MirrorGov;
  public mint: MirrorMint;
  public oracle: MirrorOracle;
  public staking: MirrorStaking;

  constructor(options: Partial<MirrorOptions> = DEFAULT_MIRROR_OPTIONS) {
    const mirrorOptions = { ...options, ...DEFAULT_MIRROR_OPTIONS };
    const {
      lcd,
      key,
      collector,
      factory,
      gov,
      mint,
      oracle,
      staking,
    } = mirrorOptions;
    this.collector = new MirrorCollector(collector, lcd, key);
    this.factory = new MirrorFactory(factory, lcd, key);
    this.gov = new MirrorGov(gov, lcd, key);
    this.mint = new MirrorMint(mint, lcd, key);
    this.oracle = new MirrorOracle(oracle, lcd, key);
    this.staking = new MirrorStaking(staking, lcd, key);
  }
}
