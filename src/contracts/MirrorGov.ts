import {
  AccAddress,
  Coins,
  Numeric,
  MsgExecuteContract,
  MsgInstantiateContract,
  Int
} from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { ContractClient } from './ContractClient';
import { TerraswapToken } from './TerraswapToken';

export namespace MirrorGov {
  export interface InitMsg {
    mirror_token: AccAddress;
    quorum: string;
    threshold: string;
    voting_period: number;
    effective_delay: number;
    proposal_deposit: string;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      quorum?: string;
      threshold?: string;
      voting_period?: number;
      effective_delay?: number;
      proposal_deposit?: string;
    };
  }

  export type VoteOption = 'yes' | 'no';
  export interface HandleCastVote {
    cast_vote: {
      poll_id: number;
      vote: VoteOption;
      amount: string;
    };
  }

  export interface HandleWithdrawVotingTokens {
    withdraw_voting_tokens: {
      amount?: string;
    };
  }

  export interface HandleEndPoll {
    end_poll: {
      poll_id: number;
    };
  }

  export interface HandleExecutePoll {
    execute_poll: {
      poll_id: number;
    };
  }

  export interface HookStakeVotingTokens {
    stake_voting_tokens: EmptyObject;
  }

  export interface ExecuteMsg {
    contract: AccAddress;
    msg: string;
  }

  export interface HookCreatePoll {
    create_poll: {
      title: string;
      description: string;
      link?: string;
      execute_msg?: ExecuteMsg;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryState {
    state: EmptyObject;
  }

  export interface QueryStaker {
    staker: {
      address: AccAddress;
    };
  }

  export interface QueryPoll {
    poll: {
      poll_id: number;
    };
  }

  export type PollStatus = 'in_progress' | 'passed' | 'rejected' | 'executed';

  export interface QueryPolls {
    polls: {
      filter?: PollStatus;
      start_after?: number;
      limit?: number;
    };
  }

  export interface QueryVoters {
    voters: {
      poll_id: number;
      start_after?: AccAddress;
      limit?: number;
    };
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mirror_token: AccAddress;
    quorum: string;
    threshold: string;
    voting_period: number;
    effective_delay: number;
    proposal_deposit: string;
  }

  export interface StateResponse {
    poll_count: number;
    total_share: string;
    total_deposit: string;
  }

  export interface PollResponse {
    id: number;
    creator: AccAddress;
    status: PollStatus;
    end_height: number;
    title: string;
    description: string;
    link?: string;
    deposit_amount: string;
    execute_data?: ExecuteMsg;
    yes_votes: string;
    no_votes: string;
  }

  export interface PollsResponse {
    polls: Array<PollResponse>;
  }

  export interface PollCountResponse {
    poll_count: number;
  }

  export interface VoterInfo {
    vote: VoteOption;
    share: string;
  }

  export interface StakerResponse {
    balance: string;
    share: string;
    locked_share: Array<[number, VoterInfo]>;
  }

  export interface VotersResponseItem {
    voter: AccAddress;
    vote: VoteOption;
    share: string;
    balance: string;
  }

  export interface VotersResponse {
    voters: Array<VotersResponseItem>;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleCastVote
    | HandleWithdrawVotingTokens
    | HandleEndPoll
    | HandleExecutePoll;

  export type HookMsg = HookStakeVotingTokens | HookCreatePoll;

  export type QueryMsg =
    | QueryConfig
    | QueryState
    | QueryStaker
    | QueryPoll
    | QueryPolls
    | QueryVoters;
}

function createHookMsg(msg: MirrorGov.HookMsg): string {
  return Buffer.from(JSON.stringify(msg)).toString('base64');
}

export class MirrorGov extends ContractClient {
  public init(
    init_msg: MirrorGov.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public updateConfig(
    config: MirrorGov.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public castVote(
    poll_id: number,
    vote: MirrorGov.VoteOption,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      cast_vote: {
        poll_id,
        vote,
        amount: new Int(amount).toString()
      }
    });
  }

  public withdrawVotingTokens(amount?: Numeric.Input): MsgExecuteContract {
    return this.createExecuteMsg({
      withdraw_voting_tokens: {
        amount: amount ? new Int(amount).toString() : undefined
      }
    });
  }

  public endPoll(poll_id: number): MsgExecuteContract {
    return this.createExecuteMsg({
      end_poll: {
        poll_id
      }
    });
  }

  public executePoll(poll_id: number): MsgExecuteContract {
    return this.createExecuteMsg({
      execute_poll: {
        poll_id
      }
    });
  }

  public stakeVotingTokens(
    terraswap_token: TerraswapToken,
    amount: Numeric.Input
  ): MsgExecuteContract {
    return terraswap_token.send(
      this.contractAddress,
      amount,
      createHookMsg({
        stake_voting_tokens: {}
      })
    );
  }

  public createPoll(
    terraswap_token: TerraswapToken,
    deposit_amount: Numeric.Input,
    title: string,
    description: string,
    link?: string,
    execute_msg?: MirrorGov.ExecuteMsg
  ): MsgExecuteContract {
    return terraswap_token.send(
      this.contractAddress,
      deposit_amount,
      createHookMsg({
        create_poll: {
          title,
          description,
          link,
          execute_msg
        }
      })
    );
  }

  public async getConfig(): Promise<MirrorGov.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getState(): Promise<MirrorGov.StateResponse> {
    return this.query({
      state: {}
    });
  }

  public async getStaker(
    address: AccAddress
  ): Promise<MirrorGov.StakerResponse> {
    return this.query({
      staker: {
        address
      }
    });
  }

  public async getPoll(poll_id: number): Promise<MirrorGov.PollResponse> {
    return this.query({
      poll: {
        poll_id
      }
    });
  }

  public async getPolls(
    filter?: MirrorGov.PollStatus,
    start_after?: number,
    limit?: number
  ): Promise<MirrorGov.PollsResponse> {
    return this.query({
      polls: {
        filter,
        start_after,
        limit
      }
    });
  }

  public async getVoters(
    poll_id: number,
    start_after?: AccAddress,
    limit?: number
  ): Promise<MirrorGov.VotersResponse> {
    return this.query({
      voters: {
        poll_id,
        start_after,
        limit
      }
    });
  }

  protected async query<T>(query_msg: MirrorGov.QueryMsg): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    execute_msg: MirrorGov.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(execute_msg, coins);
  }
}
