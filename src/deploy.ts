// import {
//   isTxError,
//   LocalTerra,
//   MsgInstantiateContract,
//   MsgStoreCode,
// } from '@terra-money/terra.js';
// import * as fs from 'fs';

// const terra = new LocalTerra();
// const { validator, test1 } = terra.wallets;

// const contractFiles: { [k: string]: string } = {
//   mirror_collector: './artifacts/mirror_collector.wasm',
//   mirror_factory: './artifacts/mirror_factory.wasm',
//   mirror_gov: './artifacts/mirror_gov.wasm',
//   mirror_mint: './artifacts/mirror_mint.wasm',
//   mirror_oracle: './artifacts/mirror_oracle.wasm',
//   mirror_staking: './artifacts/mirror_staking.wasm',
// };

// const codeIds: {
//   [k: string]: number;
// } = {};

// async function main(): Promise<void> {
//   // upload all contracts
//   for (let contract in contractFiles) {
//     const storeCode = new MsgStoreCode(
//       test1.key.accAddress,
//       fs.readFileSync(contractFiles[contract]).toString('base64')
//     );

//     const storeCodeTx = await test1.createAndSignTx({
//       msgs: [storeCode],
//     });

//     const storeCodeTxResult = await terra.tx.broadcast(storeCodeTx);

//     if (isTxError(storeCodeTxResult)) {
//       throw new Error(`couldn't store code for ${contract}`);
//     }

//     const codeId = +storeCodeTxResult.logs[0].eventsByType.store_code
//       .code_id[0];

//     codeIds[contract] = codeId;

//     console.log(`Uploaded ${contract} - code id: ${codeId}`);
//   }

//   // instantiate contracts
//   const instantiateContract = new MsgInstantiateContract(
//     test1.key.accAddress,
//     codeIds.mirror_collector,
//     {},
//     {},
//     false
//   );
// }

// main();
