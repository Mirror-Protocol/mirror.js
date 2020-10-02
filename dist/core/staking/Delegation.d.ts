import { JSONSerializable } from '../../util/json';
import { Dec, Int } from '../numeric';
import { AccAddress, ValAddress } from '../strings';
/**
 * Stores information about the status of a delegation between a delegator and validator, fetched from the blockchain.
 */
export declare class Delegation extends JSONSerializable<Delegation.Data> {
    delegator_address: AccAddress;
    validator_address: ValAddress;
    shares: Dec;
    balance: Int;
    /**
     * @param delegator_address 	delegator's account address
     * @param validator_address 	validator's operator address
     * @param shares 	delegator's shares
     * @param balance balance of the delegation
     */
    constructor(delegator_address: AccAddress, validator_address: ValAddress, shares: Dec, balance: Int);
    static fromData(data: Delegation.Data): Delegation;
    toData(): Delegation.Data;
}
export declare namespace Delegation {
    interface Data {
        delegator_address: AccAddress;
        validator_address: ValAddress;
        shares: string;
        balance: string;
    }
}
