"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UST = exports.isNativeToken = void 0;
function isNativeToken(assetInfo) {
    return 'native_token' in assetInfo;
}
exports.isNativeToken = isNativeToken;
exports.UST = {
    native_token: {
        denom: 'uusd'
    }
};
//# sourceMappingURL=Asset.js.map