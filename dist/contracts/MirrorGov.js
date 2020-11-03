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
exports.MirrorGov = void 0;
var terra_js_1 = require("@terra-money/terra.js");
var ContractClient_1 = require("./ContractClient");
function createHookMsg(msg) {
    return Buffer.from(JSON.stringify(msg)).toString('base64');
}
var MirrorGov = /** @class */ (function (_super) {
    __extends(MirrorGov, _super);
    function MirrorGov() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MirrorGov.prototype.init = function (init_msg, migratable) {
        return this.createInstantiateMsg(init_msg, {}, migratable);
    };
    MirrorGov.prototype.updateConfig = function (config) {
        return this.createExecuteMsg({
            update_config: config
        });
    };
    MirrorGov.prototype.castVote = function (poll_id, vote, amount) {
        return this.createExecuteMsg({
            cast_vote: {
                poll_id: poll_id,
                vote: vote,
                amount: new terra_js_1.Int(amount).toString()
            }
        });
    };
    MirrorGov.prototype.withdrawVotingTokens = function (amount) {
        return this.createExecuteMsg({
            withdraw_voting_tokens: {
                amount: amount ? new terra_js_1.Int(amount).toString() : undefined
            }
        });
    };
    MirrorGov.prototype.endPoll = function (poll_id) {
        return this.createExecuteMsg({
            end_poll: {
                poll_id: poll_id
            }
        });
    };
    MirrorGov.prototype.executePoll = function (poll_id) {
        return this.createExecuteMsg({
            execute_poll: {
                poll_id: poll_id
            }
        });
    };
    MirrorGov.prototype.stakeVotingTokens = function (terraswap_token, amount) {
        if (!this.contractAddress) {
            throw new Error('contractAddress not provided - unable to execute message');
        }
        return terraswap_token.send(this.contractAddress, amount, createHookMsg({
            stake_voting_tokens: {}
        }));
    };
    MirrorGov.prototype.createPoll = function (terraswap_token, deposit_amount, title, description, link, execute_msg) {
        if (!this.contractAddress) {
            throw new Error('contractAddress not provided - unable to execute message');
        }
        return terraswap_token.send(this.contractAddress, deposit_amount, createHookMsg({
            create_poll: {
                title: title,
                description: description,
                link: link,
                execute_msg: execute_msg
            }
        }));
    };
    MirrorGov.prototype.getConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        config: {}
                    })];
            });
        });
    };
    MirrorGov.prototype.getState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        state: {}
                    })];
            });
        });
    };
    MirrorGov.prototype.getStaker = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        staker: {
                            address: address
                        }
                    })];
            });
        });
    };
    MirrorGov.prototype.getPoll = function (poll_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        poll: {
                            poll_id: poll_id
                        }
                    })];
            });
        });
    };
    MirrorGov.prototype.getPolls = function (filter, start_after, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        polls: {
                            filter: filter,
                            start_after: start_after,
                            limit: limit
                        }
                    })];
            });
        });
    };
    MirrorGov.prototype.getVoters = function (poll_id, start_after, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query({
                        voters: {
                            poll_id: poll_id,
                            start_after: start_after,
                            limit: limit
                        }
                    })];
            });
        });
    };
    MirrorGov.prototype.query = function (query_msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, _super.prototype.query.call(this, query_msg)];
            });
        });
    };
    MirrorGov.prototype.createExecuteMsg = function (execute_msg, coins) {
        if (coins === void 0) { coins = {}; }
        return _super.prototype.createExecuteMsg.call(this, execute_msg, coins);
    };
    return MirrorGov;
}(ContractClient_1.ContractClient));
exports.MirrorGov = MirrorGov;
//# sourceMappingURL=MirrorGov.js.map