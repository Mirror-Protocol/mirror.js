import { MsgInstantiateContract, Numeric, Dec } from '@terra-money/terra.js';
import { ContractClient } from './ContractClient';

export namespace MirrorShortReward {
  export interface QueryShortRewardWeight {
    short_reward_weight: {
      premium_rate: string;
    };
  }

  export interface ShortRewardWeightResponse {
    short_reward_weight: string;
  }

  export type QueryMsg = QueryShortRewardWeight;
}

export class MirrorShortReward extends ContractClient {
  public init(): MsgInstantiateContract {
    return this.createInstantiateMsg({}, {});
  }

  public async getShortRewardWeight(
    premium_rate: Numeric.Input
  ): Promise<MirrorShortReward.ShortRewardWeightResponse> {
    return this.query({
      short_reward_weight: {
        premium_rate: new Dec(premium_rate).toString()
      }
    });
  }

  // Typed overloads

  protected async query<T>(query_msg: MirrorShortReward.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }
}
