import { MsgExecuteContract } from '@terra-money/terra.js';
import { Mirror } from '../client/MirrorClient';

export class MirrorFactory {
  public static postInitialize(): {};

  public static updateConfig(): {};

  public async updateConfig(): Promise<void> {}
  public async updateWeight(): Promise<void> {}
  public async whitelist(): Promise<void> {}
  public async tokenCreationHook(): Promise<void> {}
  public async uniswapCreationHook(): Promise<void> {}
  public async passCommand(): Promise<void> {}
  public async mint(): Promise<void> {}

  public async getConfig(): Promise<Config> {}
  public async getDistribtionInfo(): Promise<DistributionInfo> {}
}
