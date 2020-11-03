"use strict";
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
exports.ContractClient = void 0;
var terra_js_1 = require("@terra-money/terra.js");
var EmptyKey_1 = require("../utils/EmptyKey");
var ContractClient = /** @class */ (function () {
    function ContractClient(options) {
        this.contractAddress = options.contractAddress;
        this.codeID = options.codeID;
        this.lcd = options.lcd;
        this.key = options.key ? options.key : new EmptyKey_1.EmptyKey();
    }
    Object.defineProperty(ContractClient.prototype, "wallet", {
        get: function () {
            if (this.lcd === undefined) {
                throw new Error('LCDClient not provided - unable to create wallet');
            }
            return this.lcd.wallet(this.key);
        },
        enumerable: false,
        configurable: true
    });
    ContractClient.prototype.query = function (queryMmsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.contractAddress) {
                    throw new Error('contractAddress not provided - unable to query');
                }
                return [2 /*return*/, this.wallet.lcd.wasm.contractQuery(this.contractAddress, queryMmsg)];
            });
        });
    };
    ContractClient.prototype.createExecuteMsg = function (executeMsg, coins) {
        if (coins === void 0) { coins = {}; }
        if (!this.contractAddress) {
            throw new Error('contractAddress not provided - unable to execute message');
        }
        return new terra_js_1.MsgExecuteContract(this.key.accAddress, this.contractAddress, executeMsg, coins);
    };
    ContractClient.prototype.createInstantiateMsg = function (initMsg, initCoins, migratable) {
        if (initCoins === void 0) { initCoins = {}; }
        if (!this.codeID) {
            throw new Error('codeID not provided - unable to instantiate contract');
        }
        return new terra_js_1.MsgInstantiateContract(this.key.accAddress, this.codeID, initMsg, initCoins, migratable);
    };
    return ContractClient;
}());
exports.ContractClient = ContractClient;
//# sourceMappingURL=ContractClient.js.map