import { ContractClient } from './ContractClient';

export class MirrorMint extends ContractClient {
  public openPosition(
    collateral: Asset,
    assetInfo: AssetInfo,
    collateralRatio: Decimal
  ) {}

  public deposit() {}

  public withdraw() {}

  public updateConfig(config: MintConfig) {}
}
