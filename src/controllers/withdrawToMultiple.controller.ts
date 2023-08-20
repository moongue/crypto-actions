// import binanceClient from '../binanceClient/index.js';
import sleep from '../utils/sleep.ts';
import randomValueInDiapason from '../utils/randomValueInDiapason.ts';
import binanceClient from '../binanceClient/index.ts';

export type WithdrawType = {
  address: string;
  network: string;
  coin: string;
  amount: string | `${number}-${number}`;
  state: 'pending' | 'success' | 'failed' | 'waiting';
  transactionHash?: string;
};

export type CompletedWithdrawType = WithdrawType &
  (
    | {
        state: 'failed';
        amount: number;
      }
    | {
        state: 'success';
        amount: number;
        transactionHash: string;
      }
  );

const processWithdraw = async (withdraw: WithdrawType) => {
  const diapason = withdraw.amount.split('-');
  let amount: number;

  if (diapason.length === 2) {
    amount = randomValueInDiapason(Number(diapason[0]), Number(diapason[1]));
  } else {
    amount = Number(withdraw.amount);
  }

  try {
    await binanceClient.withdraw({
      coin: withdraw.coin,
      network: withdraw.network,
      address: withdraw.address,
      amount: amount,
    });
  } catch (e) {
    return {
      ...withdraw,
      amount,
      state: 'failed',
    } as CompletedWithdrawType;
  }

  return {
    ...withdraw,
    amount,
    transactionHash: '0xgfd523',
    state: 'success',
  } as CompletedWithdrawType;
};

export const withdrawToMultipleController =
  (view: (args: Array<WithdrawType | CompletedWithdrawType>) => void) => async (withdraws: WithdrawType[], interval: number) => {
    for (let index = 0; index < withdraws.length; index++) {
      withdraws[index] = await processWithdraw(withdraws[index]);

      if (index + 1 < withdraws.length) {
        withdraws[index + 1] = {
          ...withdraws[index + 1],
          state: 'waiting',
        };
      }

      view(withdraws);
      await sleep(interval);
    }
  };
