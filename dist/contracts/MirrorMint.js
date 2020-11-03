"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.MirrorMint = void 0;
var terra_js_1 = require("@terra-money/terra.js");
var Asset_1 = require("../utils/Asset");
var ContractClient_1 = require("./ContractClient");
function createHookMsg(msg) {
    return Buffer.from(JSON.stringify(msg)).toString('base64');
}
var MirrorMint = /** @class */ (function (_super) {
    __extends(MirrorMint, _super);
    function MirrorMint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MirrorMint.prototype.init = function (init_msg, migratable) {
        return this.createInstantiateMsg(init_msg, {}, migratable);
    };
    MirrorMint.prototype.updateConfig = function (config) {
        return this.createExecuteMsg({
            update_config: config
        });
    };
    MirrorMint.prototype.updateAsset = function (asset_token, auction_discount, min_collateral_ratio) {
        return this.createExecuteMsg({
            udpate_asset: {
                asset_token: asset_token,
                auction_discount: auction_discount
                    ? new terra_js_1.Dec(auction_discount).toFixed()
                    : undefined,
                min_collateral_ratio: min_collateral_ratio
                    ? new terra_js_1.Dec(min_collateral_ratio).toFixed()
                    : undefined
            }
        });
    };
    MirrorMint.prototype.registerAsset = function (asset_token, auction_discount, min_collateral_ratio) {
        return this.createExecuteMsg({
            register_asset: {
                asset_token: asset_token,
                auction_discount: new terra_js_1.Dec(auction_discount).toFixed(),
                min_collateral_ratio: new terra_js_1.Dec(min_collateral_ratio).toFixed()
            }
        });
    };
    MirrorMint.prototype.registerMigration = function (asset_token, end_price) {
        return this.createExecuteMsg({
            register_migration: {
                asset_token: asset_token,
                end_price: new terra_js_1.Dec(end_price).toFixed()
            }
        });
    };
    MirrorMint.prototype.openPosition = function (collateral, asset_info, collateral_ratio, collateral_token) {
        if (!collateral_token) {
            if (!Asset_1.isNativeToken(collateral.info)) {
                throw new Error('CollateralToken must be provided - unable to open position');
            }
            return this.createExecuteMsg({
                open_position: {
                    collateral: collateral,
                    asset_info: asset_info,
                    collateral_ratio: new terra_js_1.Dec(collateral_ratio).toFixed()
                }
            }, [new terra_js_1.Coin(collateral.info.native_token.denom, collateral.amount)]);
        }
        if (!this.contractAddress) {
            throw new Error('contractAddress not provided - unable to execute message');
        }
        return collateral_token.send.call(this, this.contractAddress, collateral.amount, createHookMsg({
            open_position: {
                asset_info: asset_info,
                collateral_ratio: new terra_js_1.Dec(collateral_ratio).toFixed()
            }
        }));
    };
    MirrorMint.prototype.deposit = function (position_idx, collateral, collateral_token) {
        if (!collateral_token) {
            if (!Asset_1.isNativeToken(collateral.info)) {
                throw new Error('CollateralToken must be provided - unable to open position');
            }
            return this.createExecuteMsg({
                deposit: {
                    position_idx: new terra_js_1.Int(position_idx).toString(),
                    collateral: collateral
                }
            }, [new terra_js_1.Coin(collateral.info.native_token.denom, collateral.amount)]);
        }
        if (!this.contractAddress) {
            throw new Error('contractAddress not provided - unable to execute message');
        }
        return collateral_token.send.call(this, this.contractAddress, collateral.amount, createHookMsg({
            deposit: {
                position_idx: new terra_js_1.Int(position_idx).toString()
            }
        }));
    };
    MirrorMint.prototype.withdraw = function (position_idx, collateral) {
        return this.createExecuteMsg({
            withdraw: {
                position_idx: new terra_js_1.Int(position_idx).toString(),
                collateral: collateral
            }
        });
    };
    MirrorMint.prototype.mint = function (position_idx, asset) {
        return this.createExecuteMsg({
            mint: {
                position_idx: new terra_js_1.Int(position_idx).toString(),
                asset: asset
            }
        });
    };
    MirrorMint.prototype.burn = function (position_idx, asset, asset_token) {
        if (!this.contractAddress) {
            throw new Error('contractAddress not provided - unable to execute message');
        }
        return asset_token.send.call(this, this.contractAddress, asset.amount, createHookMsg({
            burn: {
                position_idx: new terra_js_1.Int(position_idx).toString()
            }
        }));
    };
    MirrorMint.prototype.auction = function (position_idx, asset, asset_token) {
        if (!this.contractAddress) {
            throw new Error('contractAddress not provided - unable to execute message');
        }
        return asset_token.send(this.contractAddress, asset.amount, createHookMsg({
            auction: {
                position_idx: new terra_js_1.Int(position_idx).toString()
            }
        }));
    };
    MirrorMint.prototype.getConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        config: {}
                    })];
            });
        });
    };
    MirrorMint.prototype.getAssetConfig = function (asset_token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        asset_config: {
                            asset_token: asset_token
                        }
                    })];
            });
        });
    };
    MirrorMint.prototype.getPosition = function (position_idx) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        position: {
                            position_idx: new terra_js_1.Int(position_idx).toString()
                        }
                    })];
            });
        });
    };
    MirrorMint.prototype.getPositions = function (owner_addr, start_after, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        positions: {
                            owner_addr: owner_addr ? owner_addr : this.wallet.key.accAddress,
                            start_after: start_after ? new terra_js_1.Int(start_after).toString() : undefined,
                            limit: limit
                        }
                    })];
            });
        });
    };
    // Typed overloads
    MirrorMint.prototype.query = function (query_msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, _super.prototype.query.call(this, query_msg)];
            });
        });
    };
    MirrorMint.prototype.createExecuteMsg = function (execute_msg, coins) {
        if (coins === void 0) { coins = {}; }
        return _super.prototype.createExecuteMsg.call(this, execute_msg, coins);
    };
    return MirrorMint;
}(ContractClient_1.ContractClient));
exports.MirrorMint = MirrorMint;
//# sourceMappingURL=MirrorMint.js.map