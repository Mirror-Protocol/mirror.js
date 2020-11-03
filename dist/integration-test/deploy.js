"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployContracts = void 0;
var terra_js_1 = require("@terra-money/terra.js");
var fs = __importStar(require("fs"));
var Mirror_1 = require("../src/client/Mirror");
var contracts_1 = require("../src/contracts");
var Asset_1 = require("../src/utils/Asset");
var terra = new terra_js_1.LocalTerra();
var test1 = terra.wallets.test1;
var contractFiles = {
    mirror_collector: 'integration-test/artifacts/mirror_collector.wasm',
    mirror_factory: 'integration-test/artifacts/mirror_factory.wasm',
    mirror_gov: 'integration-test/artifacts/mirror_gov.wasm',
    mirror_mint: 'integration-test/artifacts/mirror_mint.wasm',
    mirror_oracle: 'integration-test/artifacts/mirror_oracle.wasm',
    mirror_staking: 'integration-test/artifacts/mirror_staking.wasm',
    terraswap_factory: 'integration-test/artifacts/terraswap_factory.wasm',
    terraswap_pair: 'integration-test/artifacts/terraswap_pair.wasm',
    terraswap_token: 'integration-test/artifacts/terraswap_token.wasm'
};
var codeIDs = {};
function deployContracts() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _i, contract, storeCode, storeCodeTx, storeCodeTxResult, codeId, factory, mirrorToken, gov, oracle, mint, staking, terraswapFactory, collector, mirror, mirrorPairCreationLogs, mirrorLpToken, mirrorPair, whitelistAAPLLogs, appleToken, applePair, appleLpToken;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in contractFiles)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    contract = _a[_i];
                    storeCode = new terra_js_1.MsgStoreCode(test1.key.accAddress, fs.readFileSync(contractFiles[contract]).toString('base64'));
                    return [4 /*yield*/, test1.createAndSignTx({
                            msgs: [storeCode]
                        })];
                case 2:
                    storeCodeTx = _c.sent();
                    return [4 /*yield*/, terra.tx.broadcast(storeCodeTx)];
                case 3:
                    storeCodeTxResult = _c.sent();
                    if (terra_js_1.isTxError(storeCodeTxResult)) {
                        throw new Error("couldn't store code for " + contract);
                    }
                    codeId = +storeCodeTxResult.logs[0].eventsByType.store_code
                        .code_id[0];
                    codeIDs[contract] = codeId;
                    console.log("Uploaded " + contract + " - code id: " + codeId);
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [4 /*yield*/, instantiate(createFactory())];
                case 6:
                    factory = _c.sent();
                    return [4 /*yield*/, instantiate(createMirrorToken(factory))];
                case 7:
                    mirrorToken = _c.sent();
                    return [4 /*yield*/, instantiate(createGov(mirrorToken))];
                case 8:
                    gov = _c.sent();
                    return [4 /*yield*/, instantiate(createOracle(factory))];
                case 9:
                    oracle = _c.sent();
                    return [4 /*yield*/, instantiate(createMint(factory, oracle))];
                case 10:
                    mint = _c.sent();
                    return [4 /*yield*/, instantiate(createStaking(factory, mirrorToken))];
                case 11:
                    staking = _c.sent();
                    return [4 /*yield*/, instantiate(createTerraswapFactory())];
                case 12:
                    terraswapFactory = _c.sent();
                    return [4 /*yield*/, instantiate(createCollector(gov, terraswapFactory, mirrorToken))];
                case 13:
                    collector = _c.sent();
                    mirror = new Mirror_1.Mirror({
                        factory: factory,
                        mirrorToken: mirrorToken,
                        gov: gov,
                        oracle: oracle,
                        mint: mint,
                        staking: staking,
                        terraswapFactory: terraswapFactory,
                        collector: collector,
                        key: test1.key
                    });
                    // Create MIR-UST pair
                    console.log('CREATE TERRASWAP_PAIR for MIR-UST');
                    return [4 /*yield*/, execute(mirror.terraswapFactory.createPair(factory, collector, '0.0025', '0.005', [
                            Asset_1.UST,
                            {
                                token: {
                                    contract_addr: mirrorToken
                                }
                            }
                        ]))];
                case 14:
                    mirrorPairCreationLogs = _c.sent();
                    mirrorLpToken = mirrorPairCreationLogs.liquidity_token_addr[0];
                    mirrorPair = mirrorPairCreationLogs.pair_contract_addr[0];
                    mirror.assets.push({
                        name: 'Mirror Token',
                        symbol: 'MIR',
                        token: new contracts_1.TerraswapToken({ contractAddress: mirrorToken, key: test1.key }),
                        lpToken: new contracts_1.TerraswapToken({
                            contractAddress: mirrorLpToken,
                            key: test1.key
                        }),
                        pair: new contracts_1.TerraswapPair({
                            contractAddress: mirrorPair,
                            key: test1.key
                        })
                    });
                    // PostInitailize factory
                    console.log('POST_INITIALZE FACTORY');
                    return [4 /*yield*/, execute(mirror.factory.postInitialize(test1.key.accAddress, terraswapFactory, mirrorToken, staking, oracle, mint, collector))];
                case 15:
                    _c.sent();
                    // Whitelist MIR
                    console.log('WHITELIST MIRROR');
                    return [4 /*yield*/, execute(mirror.factory.terraswapCreationHook(mirrorToken))];
                case 16:
                    _c.sent();
                    console.log('WHITELIST AAPL');
                    return [4 /*yield*/, execute(mirror.factory.whitelist('APPLE Derivative', 'AAPL', test1.key.accAddress, {
                            weight: '1.0',
                            lp_commission: '0.0025',
                            owner_commission: '0.005',
                            auction_discount: '0.2',
                            min_collateral_ratio: '1.5'
                        }))];
                case 17:
                    whitelistAAPLLogs = _c.sent();
                    appleToken = whitelistAAPLLogs['asset_token_addr'][0];
                    applePair = whitelistAAPLLogs['pair_contract_addr'][0];
                    appleLpToken = whitelistAAPLLogs['liquidity_token_addr'][0];
                    return [4 /*yield*/, execute(mirror.factory.updateConfig({
                            owner: gov
                        }))];
                case 18:
                    _c.sent();
                    return [2 /*return*/, {
                            gov: gov,
                            factory: factory,
                            terraswapFactory: terraswapFactory,
                            mirrorToken: mirrorToken,
                            staking: staking,
                            oracle: oracle,
                            mint: mint,
                            collector: collector,
                            mirrorLpToken: mirrorLpToken,
                            mirrorPair: mirrorPair,
                            appleToken: appleToken,
                            applePair: applePair,
                            appleLpToken: appleLpToken
                        }];
            }
        });
    });
}
exports.deployContracts = deployContracts;
var createFactory = function () {
    return new contracts_1.MirrorFactory({ codeID: codeIDs['mirror_factory'], key: test1.key }).init({
        mint_per_block: '10000000',
        token_code_id: codeIDs['terraswap_token'],
        base_denom: Asset_1.UST.native_token.denom
    }, false);
};
var createMirrorToken = function (factory) {
    return new contracts_1.TerraswapToken({
        codeID: codeIDs['terraswap_token'],
        key: test1.key
    }).init({
        name: 'Mirror Token',
        symbol: 'MIR',
        decimals: 6,
        initial_balances: [],
        mint: {
            minter: factory
        }
    }, false);
};
var createGov = function (mirrorToken) {
    return new contracts_1.MirrorGov({
        codeID: codeIDs['mirror_gov'],
        key: test1.key
    }).init({
        mirror_token: mirrorToken,
        quorum: '0.34',
        threshold: '0.5',
        voting_period: 1000,
        effective_delay: 1000,
        proposal_deposit: '1000000'
    }, false);
};
var createOracle = function (factory) {
    return new contracts_1.MirrorOracle({
        codeID: codeIDs['mirror_oracle'],
        key: test1.key
    }).init({
        owner: factory,
        base_asset_info: Asset_1.UST
    }, false);
};
var createMint = function (factory, oracle) {
    return new contracts_1.MirrorMint({
        codeID: codeIDs['mirror_mint'],
        key: test1.key
    }).init({
        owner: factory,
        oracle: oracle,
        base_asset_info: Asset_1.UST,
        token_code_id: codeIDs['terraswap_token']
    }, false);
};
var createStaking = function (factory, mirrorToken) {
    return new contracts_1.MirrorStaking({
        codeID: codeIDs['mirror_staking'],
        key: test1.key
    }).init({
        owner: factory,
        mirror_token: mirrorToken
    }, false);
};
var createTerraswapFactory = function () {
    return new contracts_1.TerraswapFactory({
        codeID: codeIDs['terraswap_factory'],
        key: test1.key
    }).init({
        pair_code_id: codeIDs['terraswap_pair'],
        token_code_id: codeIDs['terraswap_token']
    }, false);
};
var createCollector = function (gov, terraswapFactory, mirrorToken) {
    return new contracts_1.MirrorCollector({
        codeID: codeIDs['mirror_collector'],
        key: test1.key
    }).init({
        distribution_contract: gov,
        terraswap_factory: terraswapFactory,
        mirror_token: mirrorToken,
        base_denom: Asset_1.UST.native_token.denom
    }, false);
};
function instantiate(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var tx, result, contractAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test1.createAndSignTx({
                        msgs: [msg],
                        fee: new terra_js_1.StdFee(500000, { uluna: 1000000 })
                    })];
                case 1:
                    tx = _a.sent();
                    return [4 /*yield*/, terra.tx.broadcast(tx)];
                case 2:
                    result = _a.sent();
                    if (terra_js_1.isTxError(result)) {
                        throw new Error("Error while instantiating: " + result.code + " - " + result.raw_log);
                    }
                    contractAddress = result.logs[0].eventsByType.instantiate_contract.contract_address[0];
                    return [2 /*return*/, contractAddress];
            }
        });
    });
}
function execute(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var tx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test1.createAndSignTx({
                        msgs: [msg],
                        fee: new terra_js_1.StdFee(1000000, { uluna: 1000000 })
                    })];
                case 1:
                    tx = _a.sent();
                    return [4 /*yield*/, terra.tx.broadcast(tx)];
                case 2:
                    result = _a.sent();
                    if (terra_js_1.isTxError(result)) {
                        console.log(JSON.stringify(result));
                        throw new Error("Error while executing: " + result.code + " - " + result.raw_log);
                    }
                    return [2 /*return*/, result.logs[0].eventsByType.from_contract];
            }
        });
    });
}
//# sourceMappingURL=deploy.js.map