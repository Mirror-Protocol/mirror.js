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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Int = exports.Dec = exports.Numeric = exports.DEC_PRECISION = void 0;
var decimal_js_1 = __importDefault(require("decimal.js"));
exports.DEC_PRECISION = 18;
var _Dec = decimal_js_1.default.clone();
_Dec.prototype.toString = function () {
    return this.toFixed(exports.DEC_PRECISION);
};
var Numeric;
(function (Numeric) {
    function parse(value) {
        if (value instanceof Dec) {
            return value;
        }
        else if (typeof value === 'string') {
            if (value.includes('.')) {
                return new Dec(value);
            }
            else {
                return new Int(value);
            }
        }
        else {
            var _value = new decimal_js_1.default(value);
            if (_value.isInteger()) {
                return new Int(_value);
            }
            else {
                return new Dec(_value.toString());
            }
        }
    }
    Numeric.parse = parse;
})(Numeric = exports.Numeric || (exports.Numeric = {}));
/**
 * Represents decimal values serialized with 18 digits of precision. This implementation
 * is based on the `decimal.js` library, and returns Dec values for only [[Dec.add]],
 * [[Dec.sub]], [[Dec.mul]], [[Dec.div]], and [[Dec.mod]]. For other methods inherited
 * from `Decimal`, you will need to convert back to `Dec` to remain compatible for
 * submitting information that requires `Dec` format back to the blockchain.
 *
 * Example:
 *
 * ```ts
 * const dec = new Dec(1.5);
 *
 * const decimal = dec.sqrt();
 * const dec2 = new Dec(decimal);
 */
var Dec = /** @class */ (function (_super) {
    __extends(Dec, _super);
    function Dec(arg) {
        return _super.call(this, arg.toString()) || this;
    }
    Dec.withPrec = function (value, prec) {
        return new Dec(new Dec(value).div(Math.pow(10, prec)));
    };
    // type conversion
    Dec.prototype.toInt = function () {
        return new Int(this);
    };
    // arithmetic
    Dec.prototype.add = function (other) {
        var val = new Dec(Numeric.parse(other));
        return new Dec(_super.prototype.add.call(this, val));
    };
    Dec.prototype.sub = function (other) {
        var val = new Dec(Numeric.parse(other));
        return new Dec(_super.prototype.sub.call(this, val));
    };
    Dec.prototype.mul = function (other) {
        var val = new Dec(Numeric.parse(other));
        return new Dec(_super.prototype.mul.call(this, val));
    };
    Dec.prototype.div = function (other) {
        var val = new Dec(Numeric.parse(other));
        return new Dec(_super.prototype.div.call(this, val));
    };
    Dec.prototype.mod = function (other) {
        var val = new Dec(Numeric.parse(other));
        return new Dec(_super.prototype.mod.call(this, val));
    };
    return Dec;
}(_Dec));
exports.Dec = Dec;
var _Int = decimal_js_1.default.clone();
/**
 * Represents Integer values. Used mainly to store integer values of [[Coin]] and [[Coins]].
 *
 * Note: Do not use to work with values greater than 9999999999999999999. This
 * implementation is based on the `decimal.js` library, and returns Int values for only
 * [[Int.add]], [[Int.sub]], [[Int.mul]], [[Int.div]], and [[Int.mod]]. For other
 * methods inherited from `Decimal`, you will need to convert back to `Int` to remain
 * compatible for submitting information that requires `Int` format back to the
 * blockchain.
 *
 * Example:
 *
 * ```ts
 * const int = new Int(1.5);
 *
 * const decimal = int.pow(3);
 * const int2 = new Int(decimal);
 */
var Int = /** @class */ (function (_super) {
    __extends(Int, _super);
    function Int(arg) {
        var _this = this;
        var _arg = new decimal_js_1.default(arg.toString());
        _this = _super.call(this, _arg.divToInt(1)) || this;
        return _this;
    }
    Int.prototype.toString = function () {
        return this.toFixed();
    };
    // type conversion
    Int.prototype.toDec = function () {
        return new Dec(this);
    };
    // artihmetic
    Int.prototype.add = function (other) {
        var val = Numeric.parse(other);
        if (val instanceof Dec) {
            return new Dec(this).add(val);
        }
        else {
            return new Int(this.plus(val));
        }
    };
    Int.prototype.sub = function (other) {
        var val = Numeric.parse(other);
        if (val instanceof Dec) {
            return new Dec(this).sub(val);
        }
        else {
            return new Int(this.minus(val));
        }
    };
    Int.prototype.mul = function (other) {
        var val = Numeric.parse(other);
        if (val instanceof Dec) {
            return new Dec(this).mul(val);
        }
        else {
            return new Int(this.times(val));
        }
    };
    Int.prototype.div = function (other) {
        var val = Numeric.parse(other);
        if (val instanceof Dec) {
            return new Dec(this).div(val);
        }
        else {
            return new Int(_super.prototype.div.call(this, val));
        }
    };
    Int.prototype.mod = function (other) {
        var val = Numeric.parse(other);
        if (val instanceof Dec) {
            return new Dec(this).mod(val);
        }
        else {
            return new Int(_super.prototype.mod.call(this, val));
        }
    };
    return Int;
}(_Int));
exports.Int = Int;
//# sourceMappingURL=numeric.js.map