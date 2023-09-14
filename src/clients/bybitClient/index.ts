import { RestClientV5, RestClientOptions } from 'bybit-api';
import { WithdrawType } from '../../types/clients.ts';

const BYBIT_API_KEY = process.env.BYBIT_API_KEY as string;
const BYBIT_SECRET_KEY = process.env.BYBIT_SECRET_KEY as string;

class BybitClient extends RestClientV5 {
  isReady: boolean;
  constructor(options: RestClientOptions) {
    super(options);
    this.isReady = !!options.key && !!options.secret;
  }

  async withdraw(params: WithdrawType) {
    const { result } = await super.submitWithdrawal({
      coin: params.coin,
      chain: params.network,
      address: params.address,
      amount: String(params.amount),
      timestamp: Date.now(),
    });

    return result;
  }
}

export const bybitClient = new BybitClient({
  key: BYBIT_API_KEY,
  secret: BYBIT_SECRET_KEY,
});
