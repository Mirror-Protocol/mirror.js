import { assert } from 'console';
import { Mirror } from '../src/client';
import { execute, terra } from './lib';

const { test1 } = terra.wallets;

export async function testGov(mirror: Mirror) {
  const mirrorToken = mirror.assets.MIR.token.contractAddress || '';

  console.log('Query config');
  const config = await mirror.gov.getConfig();
  const voterWeight = parseFloat(config.voter_weight);

  console.log('Query initial state');
  const initialState = await mirror.gov.getState();
  const initialDeposit: number = parseInt(initialState.total_deposit);
  const initialShare: number = parseInt(initialState.total_share);
  const initialVotingRewards: number = parseInt(
    initialState.pending_voting_rewards
  );

  const balanceRes = await mirror.mirrorToken.getBalance(
    mirror.gov.contractAddress
  );
  const initialBalance: number = parseInt(balanceRes.balance);

  console.log('Stake MIR tokens');
  const stakeRes = await execute(
    test1,
    mirror.gov.stakeVotingTokens(mirror.assets.MIR.token, 1000100)
  );
  let addedShare = 1000100;
  if (initialBalance > 0) {
    addedShare = Math.trunc(
      (1000100 * initialShare) /
        (initialBalance - initialDeposit - initialVotingRewards)
    );
  }

  assert(stakeRes['share'][0] == addedShare.toString());

  console.log('Create poll');
  const createPollRes = await execute(
    test1,
    mirror.gov.createPoll(
      mirror.assets.MIR.token,
      1000000,
      'Test poll',
      'Test description'
    )
  );
  const pollId = createPollRes['poll_id'][0];

  console.log('Cast vote');
  await execute(test1, mirror.gov.castVote(parseInt(pollId), 'yes', 1000000));

  console.log('Deposit reward');
  await execute(
    test1,
    mirror.gov.depositReward(mirror.assets.MIR.token, 1000000)
  );

  console.log('Query state');
  const state = await mirror.gov.getState();
  assert(state.total_deposit == (initialDeposit + 1000000).toString());
  assert(state.total_share == (initialShare + addedShare).toString());
  assert(
    state.pending_voting_rewards ==
      (initialVotingRewards + Math.trunc(1000000 * voterWeight)).toString()
  );

  console.log('Snapshot poll - expect error');
  await execute(test1, mirror.gov.snapshotPoll(parseInt(pollId))).catch(
    (error) => {
      assert(
        error.response.data.error.includes('Cannot snapshot at this height')
      );
    }
  );

  console.log('End poll - expect error');
  await execute(test1, mirror.gov.endPoll(parseInt(pollId))).catch((error) => {
    assert(error.response.data.error.includes('Voting period has not expired'));
  });

  console.log('Withdraw MIR');
  await execute(test1, mirror.gov.withdrawVotingTokens(100));

  console.log('Query staker');
  const stakerRes = await mirror.gov.getStaker(test1.key.accAddress);

  if (stakerRes.pending_voting_rewards != '0') {
    console.log('Withdraw voting rewards');
    await execute(test1, mirror.gov.withdrawVotingRewards());
  } else {
    console.log('There are no voting rewards to withdraw at the moment');
  }
}
