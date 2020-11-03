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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyKey = void 0;
var terra_js_1 = require("@terra-money/terra.js");
var EmptyKey = /** @class */ (function (_super) {
    __extends(EmptyKey, _super);
    function EmptyKey() {
        return _super.call(this, Buffer.from('')) || this;
    }
    // eslint-disable-next-line class-methods-use-this
    EmptyKey.prototype.sign = function () {
        throw new Error('Key is empty - provide a Key when creating ContractClient to sign transactions.');
    };
    return EmptyKey;
}(terra_js_1.Key));
exports.EmptyKey = EmptyKey;
//# sourceMappingURL=EmptyKey.js.map