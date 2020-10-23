import { Key } from '@terra-money/terra.js';

export default class EmptyKey extends Key {
  constructor() {
    super(Buffer.from(''));
  }

  // eslint-disable-next-line class-methods-use-this
  public sign(): Promise<Buffer> {
    throw new Error(
      'Key is empty - provide a Key when creating ContractClient to sign transactions.'
    );
  }
}
