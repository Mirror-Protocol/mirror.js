import { Key } from '@terra-money/terra.js';

export class EmptyKey extends Key {
  constructor() {
    super(undefined);
  }

  // eslint-disable-next-line class-methods-use-this
  public sign(): Promise<Buffer> {
    throw new Error(
      'Key is empty - provide a Key when creating ContractClient to sign transactions.'
    );
  }
}
