import { AccAddress, LCDClient, Wallet } from '@terra-money/terra.js';
import { ContractClient } from './ContractClient';

export class TerraswapPair extends ContractClient {
  public async postInitialize() {
    const tx = this.wallet.createAndSignTx({});
  }
  public async updateConfig() {}
  public async provideLiquidity() {}
  public async swap() {}

  public async getConfigGeneral() {}
  public async getConfigAsset() {}
  public async getConfigSwap() {}
  public async getPool() {}
  public async getSimulation() {}
  public async getReverseSimulation() {}
}
