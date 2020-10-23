import {
  AccAddress,
  Coins,
  Key,
  LCDClient,
  MsgExecuteContract,
  Wallet,
  MsgInstantiateContract
} from '@terra-money/terra.js';

import EmptyKey from '../utils/EmptyKey';

export default class ContractClient {
  public contractAddress: AccAddress;

  public codeID?: number;

  public lcd?: LCDClient;

  public key: Key;

  constructor(
    contractAddress: AccAddress,
    codeID?: number,
    lcd?: LCDClient,
    key?: Key
  ) {
    this.contractAddress = contractAddress;
    this.codeID = codeID;
    this.lcd = lcd;

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

  protected async query<T>(queryMmsg: any): Promise<T> {
    return this.wallet.lcd.wasm.contractQuery<T>(
      this.contractAddress,
      queryMmsg
    );
  }

  protected createExecuteMsg(
    executeMsg: any,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return new MsgExecuteContract(
      this.key.accAddress,
      this.contractAddress,
      executeMsg,
      coins
    );
  }

  protected createInstantiateMsg(
    initMsg: any,
    initCoins: Coins.Input = {},
    migratable: boolean
  ): MsgInstantiateContract {
    if (!this.codeID) {
      throw new Error('codeID not provided - unable to instantiate contract');
    }
    return new MsgInstantiateContract(
      this.key.accAddress,
      this.codeID,
      initMsg,
      initCoins,
      migratable
    );
  }
}

module.exports = ContractClient;
