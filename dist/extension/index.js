"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extension = void 0;
/**
 * Extension class is for communicating between page and extension
 */
var Extension = /** @class */ (function () {
    /**
     * Using singleton pattern, hence every instanciation will return same value
     */
    function Extension() {
        if (Extension.instance) {
            return Extension.instance;
        }
        Extension.instance = this;
        var LocalMessageDuplexStream = require('post-message-stream');
        this.inpageStream = new LocalMessageDuplexStream({
            name: 'station:inpage',
            target: 'station:content',
        });
    }
    Extension.prototype.generateId = function () {
        return Date.now();
    };
    Object.defineProperty(Extension.prototype, "isAvailable", {
        /**
         * Indicates the Station Extension is installed and availble (requires extension v1.1 or later)
         */
        get: function () {
            var _a;
            return (_a = window === null || window === void 0 ? void 0 : window.Terra) === null || _a === void 0 ? void 0 : _a.isAvailable;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * low level function for sending message to extension.
     * Do not use this function unless you know what you are doing.
     */
    Extension.prototype.send = function (data) {
        this.inpageStream.write(data);
    };
    /**
     * Listen to events from the Extension.
     * You will receive an event after calling connect, sign, or post.
     * payload structures are described on each function in @return section.
     *
     * @param name name of event
     * @param callback will be called when `name` event emits
     */
    Extension.prototype.on = function (name, callback) {
        this.inpageStream.on('data', function (data) {
            data.name === name && callback(data.payload);
        });
    };
    /**
     * Request to Station Extension for connecting a wallet
     *
     * @return {string}     name      'onConnect'
     * @return {AccAddress} payload   Terra account address
     */
    Extension.prototype.connect = function () {
        var id = this.generateId();
        this.send({
            id: id,
            type: 'connect',
        });
        return id;
    };
    /**
     * Request to Station Extension for signing tx
     *
     * @param msgs transaction messages to be signed
     * @param account_number account number (optional)
     * @param sequence sequence (optional)
     *
     * @return {string}  name               'onSign'
     * @return {object}  payload
     * @return {number}  payload.id         identifier
     * @return {string}  payload.origin     origin address
     * @return {Msg[]}   payload.msgs       requested msgs
     * @return {boolean} payload.success
     * @return {string}  payload.result.public_key Base64 encoded public key
     * @return {string}  payload.result.signature  Base64 encoded signature
     * @return {number}  payload.result.recid      Recovery id
     * @return {StdSignMsg.Data} payload.result.stdSignMsgData
     *
     * @example of broadcasting
     *
     * const { signature, public_key, recid, stdSignMsg } = payload.result;
     *
     * const sig = StdSignature.fromData({
     *   signature,
     *   pub_key: {
     *    type: 'tendermint/PubKeySecp256k1',
     *    value: public_key,
     *  },
     * });
     *
     * const stdSignMsg = StdSignMsg.fromData(payload.result.stdSignMsgData);
     * terra.tx.broadcast(new StdTx(stdSignMsg.msgs, stdSignMsg.fee, [sig], stdSignMsg.memo));
     */
    Extension.prototype.sign = function (options) {
        var _a, _b, _c;
        var id = this.generateId();
        this.send(__assign(__assign({}, options), { id: id, type: 'sign', lcdClientConfig: options.lcdClientConfig, account_number: options.account_number, sequence: options.sequence, memo: options.memo, msgs: options.msgs.map(function (msg) { return msg.toJSON(); }), fee: (_a = options.fee) === null || _a === void 0 ? void 0 : _a.toJSON(), gasPrices: (_b = options.gasPrices) === null || _b === void 0 ? void 0 : _b.toString(), gasAdjustment: (_c = options.gasAdjustment) === null || _c === void 0 ? void 0 : _c.toString() }));
        return id;
    };
    /**
     * Request to Station Extension for sign and post to LCD server
     *
     * @param msgs transaction messages to be signed
     * @param lcdClientConfig LCDClientConfig (optional)
     *
     * @return {string}  name                   'onPost'
     * @return {object}  payload
     * @return {number}  payload.id             identifier
     * @return {string}  payload.origin         origin address
     * @return {Msg[]}   payload.msgs           requested msgs
     * @return {LCDClientConfig} payload.lcdClientConfig
     *                                          requested lcdClientConfig
     * @return {boolean} payload.success
     * @return {number|undefined} payload.result.code
     *                                          error code. undefined with successful tx
     * @return {string}  payload.result.raw_log raw log
     * @return {string}  payload.result.txhash  transaction hash
     */
    Extension.prototype.post = function (options) {
        var _a, _b, _c;
        var id = this.generateId();
        this.send({
            id: id,
            type: 'post',
            lcdClientConfig: options.lcdClientConfig,
            account_number: options.account_number,
            sequence: options.sequence,
            memo: options.memo,
            msgs: options.msgs.map(function (msg) { return msg.toJSON(); }),
            fee: (_a = options.fee) === null || _a === void 0 ? void 0 : _a.toJSON(),
            gasPrices: (_b = options.gasPrices) === null || _b === void 0 ? void 0 : _b.toString(),
            gasAdjustment: (_c = options.gasAdjustment) === null || _c === void 0 ? void 0 : _c.toString(),
        });
        return id;
    };
    return Extension;
}());
exports.Extension = Extension;
//# sourceMappingURL=index.js.map