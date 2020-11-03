import { AccAddress, Coins, Numeric, MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js';
import { EmptyObject } from '../utils/EmptyObject';
import { ContractClient } from './ContractClient';
import { TerraswapToken } from './TerraswapToken';
export declare namespace MirrorGov {
    interface InitMsg {
        mirror_token: AccAddress;
        quorum: string;
        threshold: string;
        voting_period: number;
        effective_delay: number;
        proposal_deposit: string;
    }
    interface HandleUpdateConfig {
        update_config: {
            owner?: AccAddress;
            quorum?: string;
            threshold?: string;
            voting_period?: number;
            effective_delay?: number;
            proposal_deposit?: string;
        };
    }
    type VoteOption = 'yes' | 'no';
    interface HandleCastVote {
        cast_vote: {
            poll_id: number;
            vote: VoteOption;
            amount: string;
        };
    }
    interface HandleWithdrawVotingTokens {
        withdraw_voting_tokens: {
            amount?: string;
        };
    }
    interface HandleEndPoll {
        end_poll: {
            poll_id: number;
        };
    }
    interface HandleExecutePoll {
        execute_poll: {
            poll_id: number;
        };
    }
    interface HookStakeVotingTokens {
        stake_voting_tokens: EmptyObject;
    }
    interface ExecuteMsg {
        contract: AccAddress;
        msg: string;
    }
    interface HookCreatePoll {
        create_poll: {
            title: string;
            description: string;
            link?: string;
            execute_msg?: ExecuteMsg;
        };
    }
    interface QueryConfig {
        config: EmptyObject;
    }
    interface QueryState {
        state: EmptyObject;
    }
    interface QueryStaker {
        staker: {
            address: AccAddress;
        };
    }
    interface QueryPoll {
        poll: {
            poll_id: number;
        };
    }
    type PollStatus = 'in_progress' | 'passed' | 'rejected' | 'executed';
    interface QueryPolls {
        polls: {
            filter?: PollStatus;
            start_after?: number;
            limit?: number;
        };
    }
    interface QueryVoters {
        voters: {
            poll_id: number;
            start_after?: AccAddress;
            limit?: number;
        };
    }
    interface ConfigResponse {
        owner: AccAddress;
        mirror_token: AccAddress;
        quorum: string;
        threshold: string;
        voting_period: number;
        effective_delay: number;
        proposal_deposit: string;
    }
    interface StateResponse {
        poll_count: number;
        total_share: string;
        total_deposit: string;
    }
    interface PollResponse {
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
    interface PollsResponse {
        polls: Array<PollResponse>;
    }
    interface PollCountResponse {
        poll_count: number;
    }
    interface VoterInfo {
        vote: VoteOption;
        share: string;
    }
    interface StakerResponse {
        balance: string;
        share: string;
        locked_share: Array<[number, VoterInfo]>;
    }
    interface VotersResponseItem {
        voter: AccAddress;
        vote: VoteOption;
        share: string;
        balance: string;
    }
    interface VotersResponse {
        voters: Array<VotersResponseItem>;
    }
    type HandleMsg = HandleUpdateConfig | HandleCastVote | HandleWithdrawVotingTokens | HandleEndPoll | HandleExecutePoll;
    type HookMsg = HookStakeVotingTokens | HookCreatePoll;
    type QueryMsg = QueryConfig | QueryState | QueryStaker | QueryPoll | QueryPolls | QueryVoters;
}
export declare class MirrorGov extends ContractClient {
    init(init_msg: MirrorGov.InitMsg, migratable: boolean): MsgInstantiateContract;
    updateConfig(config: MirrorGov.HandleUpdateConfig['update_config']): MsgExecuteContract;
    castVote(poll_id: number, vote: MirrorGov.VoteOption, amount: Numeric.Input): MsgExecuteContract;
    withdrawVotingTokens(amount?: Numeric.Input): MsgExecuteContract;
    endPoll(poll_id: number): MsgExecuteContract;
    executePoll(poll_id: number): MsgExecuteContract;
    stakeVotingTokens(terraswap_token: TerraswapToken, amount: Numeric.Input): MsgExecuteContract;
    createPoll(terraswap_token: TerraswapToken, deposit_amount: Numeric.Input, title: string, description: string, link?: string, execute_msg?: MirrorGov.ExecuteMsg): MsgExecuteContract;
    getConfig(): Promise<MirrorGov.ConfigResponse>;
    getState(): Promise<MirrorGov.StateResponse>;
    getStaker(address: AccAddress): Promise<MirrorGov.StakerResponse>;
    getPoll(poll_id: number): Promise<MirrorGov.PollResponse>;
    getPolls(filter?: MirrorGov.PollStatus, start_after?: number, limit?: number): Promise<MirrorGov.PollsResponse>;
    getVoters(poll_id: number, start_after?: AccAddress, limit?: number): Promise<MirrorGov.VotersResponse>;
    protected query<T>(query_msg: MirrorGov.QueryMsg): Promise<T>;
    protected createExecuteMsg(execute_msg: MirrorGov.HandleMsg, coins?: Coins.Input): MsgExecuteContract;
}
