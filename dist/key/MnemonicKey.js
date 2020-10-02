"use strict";
// Adapted from https://github.com/terra-project/terra-js/blob/master/src/utils/keyUtils.ts
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicKey = exports.LUNA_COIN_TYPE = void 0;
var bip32 = __importStar(require("bip32"));
var bip39 = __importStar(require("bip39"));
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var secp256k1 = __importStar(require("secp256k1"));
var Key_1 = require("./Key");
exports.LUNA_COIN_TYPE = 330;
var DEFAULT_OPTIONS = {
    account: 0,
    index: 0,
    coinType: exports.LUNA_COIN_TYPE,
};
/**
 * Implements a BIP39 mnemonic wallet with standard key derivation from a word list. Note
 * that this implementation exposes the private key in memory, so it is not advised to use
 * for applications requiring high security.
 */
var MnemonicKey = /** @class */ (function (_super) {
    __extends(MnemonicKey, _super);
    /**
     * Creates a new signing key from a mnemonic phrase. If no mnemonic is provided, one
     * will be automatically generated.
     *
     * ### Providing a mnemonic
     *
     * ```ts
     * import { MnemonicKey } from 'terra.js';
     *
     * const mk = new MnemonicKey({ mnemonic: '...' });
     * console.log(mk.accAddress);
     * ```
     *
     * ### Generating a random mnemonic
     *
     * ```ts
     * const mk2 = new MnemonicKey();
     * console.log(mk2.mnemonic);
     * ```
     *
     * @param options
     */
    function MnemonicKey(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var _a = __assign(__assign({}, DEFAULT_OPTIONS), options), account = _a.account, index = _a.index, coinType = _a.coinType;
        var mnemonic = options.mnemonic;
        if (mnemonic === undefined) {
            mnemonic = bip39.generateMnemonic(256);
        }
        var seed = bip39.mnemonicToSeedSync(mnemonic);
        var masterKey = bip32.fromSeed(seed);
        var hdPathLuna = "m/44'/" + coinType + "'/" + account + "'/0/" + index;
        var terraHD = masterKey.derivePath(hdPathLuna);
        var privateKey = terraHD.privateKey;
        if (!privateKey) {
            throw new Error('Failed to derive key pair');
        }
        var publicKey = secp256k1.publicKeyCreate(new Uint8Array(privateKey), true);
        _this = _super.call(this, Buffer.from(publicKey)) || this;
        _this.privateKey = Buffer.from(privateKey);
        _this.mnemonic = mnemonic;
        return _this;
    }
    MnemonicKey.prototype.ecdsaSign = function (payload) {
        var hash = Buffer.from(sha256_1.default(payload.toString()).toString(), 'hex');
        return secp256k1.ecdsaSign(Uint8Array.from(hash), Uint8Array.from(this.privateKey));
    };
    MnemonicKey.prototype.sign = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var signature;
            return __generator(this, function (_a) {
                signature = this.ecdsaSign(payload).signature;
                return [2 /*return*/, Buffer.from(signature)];
            });
        });
    };
    return MnemonicKey;
}(Key_1.Key));
exports.MnemonicKey = MnemonicKey;
//# sourceMappingURL=MnemonicKey.js.map