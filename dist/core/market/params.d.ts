import { Denom } from '../Denom';
import { ParamChange } from '..';
import { Dec } from '../numeric';
declare type PoolRecoveryPeriod = ParamChange.Type<'market', 'poolrecoveryperiod', number>;
declare type BasePool = ParamChange.Type<'market', 'basepool', Dec>;
declare type MinSpread = ParamChange.Type<'market', 'minspread', Dec>;
export interface TaxRate {
    denom: Denom;
    tax_rate: Dec;
}
export declare namespace TaxRate {
    interface Data {
        denom: Denom;
        tax_rate: string;
    }
}
declare type IlliquidTobinTaxList = ParamChange.Type<'market', 'illiquidtobintaxlist', TaxRate[]>;
export declare type MarketParamChange = PoolRecoveryPeriod | BasePool | MinSpread | IlliquidTobinTaxList;
export declare namespace MarketParamChange {
    type Data = ParamChange.Data.Type<PoolRecoveryPeriod> | ParamChange.Data.Type<BasePool> | ParamChange.Data.Type<MinSpread> | ParamChange.Data.Type<IlliquidTobinTaxList>;
}
export interface MarketParamChanges {
    market?: {
        poolrecoveryperiod?: number;
        basepool?: Dec;
        minspread?: Dec;
        illiquidtobintaxlist?: TaxRate[];
    };
}
export declare namespace MarketParamChanges {
    const ConversionTable: {
        market: {
            poolrecoveryperiod: (((string: string, radix?: number | undefined) => number) | ((c: number) => string))[];
            basepool: (((c: import("decimal.js").default.Value) => Dec) | ((c: any) => string))[];
            minspread: (((c: import("decimal.js").default.Value) => Dec) | ((c: any) => string))[];
            illiquidtobintaxlist: (((c: TaxRate.Data[]) => TaxRate[]) | ((c: TaxRate[]) => TaxRate.Data[]))[];
        };
    };
}
export {};
