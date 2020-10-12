import {
  AccAddress,
  BlockTxBroadcastResult,
  Coins,
  Key,
  LCDClient,
  MsgExecuteContract,
  StdTx,
  Wallet,
} from '@terra-money/terra.js';

class EmptyKey extends Key {
  constructor() {
    super(Buffer.from(''));
  }

  public sign(): Promise<Buffer> {
    throw new Error(
      'Key is empty - provide a Key when creating ContractClient to sign transactions.'
    );
  }
}

export class ContractClient {
  public key: Key;

  constructor(
    public contractAddress: AccAddress,
    public lcd?: LCDClient,
    key?: Key
  ) {
    if (key === undefined) {
      this.key = new EmptyKey();
    } else {
      this.key = key;
    }
  }

  public get wallet(): Wallet {
    if (this.lcd === undefined) {
      throw new Error('LCDClient not provided - unable to create wallet');
    }

    return this.lcd.wallet(this.key);
  }

  protected async query<T>(query_msg: any): Promise<T> {
    return this.wallet.lcd.wasm.contractQuery<T>(
      this.contractAddress,
      query_msg
    );
  }

  protected async broadcastExecute(
    execute_msg: any,
    coins: Coins.Input = {}
  ): Promise<BlockTxBroadcastResult> {
    const tx = await this.createTx(execute_msg, coins);
    return this.wallet.lcd.tx.broadcast(tx);
  }

  protected async createTx(
    execute_msg: any,
    coins: Coins.Input = {}
  ): Promise<StdTx> {
    const executeMsg = this.createExecuteMsg(execute_msg, coins);
    return this.wallet.createAndSignTx({
      msgs: [executeMsg],
    });
  }

  protected createExecuteMsg(
    execute_msg: any,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return new MsgExecuteContract(
      this.key.accAddress,
      this.contractAddress,
      execute_msg,
      coins
    );
  }
}
