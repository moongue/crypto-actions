import sleep from '../utils/sleep.ts';
import randomValueInDiapason from '../utils/randomValueInDiapason.ts';
import { clients, ClientsInterfacesType, ClientsType } from '../clients/index.ts';

export const WithdrawStates = {
  pending: 'pending',
  success: 'success',
  failed: 'failed',
  waiting: 'waiting',
} as const;

export type WithdrawType = {
  address: string;
  network: string;
  coin: string;
  amount: string | `${number}-${number}`;
  state: (typeof WithdrawStates)[keyof typeof WithdrawStates];
  transactionHash?: string;
};

export type CompletedWithdrawType = Omit<WithdrawType, 'amount' | 'state'> &
  (
    | {
        state: typeof WithdrawStates.failed;
        amount: number;
      }
    | {
        state: typeof WithdrawStates.success;
        amount: number;
        transactionHash: string;
      }
  );

const processWithdraw = async (withdraw: WithdrawType, client: ClientsInterfacesType) => {
  const diapason = withdraw.amount.split('-');
  let amount: number;

  if (diapason.length === 2) {
    amount = randomValueInDiapason(Number(diapason[0]), Number(diapason[1]));
  } else {
    amount = Number(withdraw.amount);
  }

  let hash: string;

  try {
    const { id } = await client.withdraw({
      coin: withdraw.coin,
      network: withdraw.network,
      address: withdraw.address,
      amount: amount,
    });
    hash = id;
  } catch (e) {
    console.error('Error while withdraw', e);
    return {
      ...withdraw,
      amount,
      state: WithdrawStates.failed,
    };
  }

  return {
    ...withdraw,
    amount,
    transactionHash: hash,
    state: WithdrawStates.success,
  };
};

export const withdrawToMultipleController =
  (view: (args: Array<WithdrawType | CompletedWithdrawType>) => void) => async (withdraws: WithdrawType[], client: ClientsType, interval: number) => {
    const withdrawClient = clients[client];
    const copyWithdraws: Array<WithdrawType | CompletedWithdrawType> = [...withdraws];

    for (let index = 0; index < copyWithdraws.length; index++) {
      copyWithdraws[index] = await processWithdraw(copyWithdraws[index] as WithdrawType, withdrawClient);

      if (index + 1 < copyWithdraws.length) {
        copyWithdraws[index + 1] = {
          ...copyWithdraws[index + 1],
          state: WithdrawStates.waiting,
        } as WithdrawType;
      }

      view(copyWithdraws);
      if (index + 1 === copyWithdraws.length) {
        break;
      }
      await sleep(interval);
    }
  };
