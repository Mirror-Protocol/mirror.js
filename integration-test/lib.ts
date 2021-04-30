import {
  LocalTerra,
  isTxError,
  MsgExecuteContract,
  Wallet
} from '@terra-money/terra.js';

export const contractAddressesFile: string = 'integration-test/artifacts/contractAddresses.json';
export const terra = new LocalTerra();

export async function execute(
  wallet: Wallet,
  ...msgs: MsgExecuteContract[]
): Promise<{
  [key: string]: string[];
}> {
  try {
    const tx = await wallet.createAndSignTx({
      msgs,
      gasPrices: { uluna: 0.015 },
      gasAdjustment: 1.4
    });

    const result = await terra.tx.broadcast(tx);
  
    if (isTxError(result)) {
      throw new Error(
        `Error while executing: ${result.code} - ${result.raw_log}`
      );
    }

    return result.logs[0].eventsByType.from_contract;
  } catch (e) {
    if (e.response.data !== undefined) {
      console.error(e.response.data);
    } else {
      console.error(JSON.stringify(e))
    }
    throw e;
  }
}