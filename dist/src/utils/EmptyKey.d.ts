/// <reference types="node" />
import { Key } from '@terra-money/terra.js';
export declare class EmptyKey extends Key {
    constructor();
    sign(): Promise<Buffer>;
}
