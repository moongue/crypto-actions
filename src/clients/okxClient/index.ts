import dotenv from 'dotenv';
dotenv.config();

import { APICredentials, RestClient } from 'okx-api';
import { WithdrawType } from '../../types/clients.ts';

const OKX_API_KEY = process.env.OKX_API_KEY as string;
const OKX_SECRET_KEY = process.env.OKX_SECRET_KEY as string;
const API_PASS = process.env.OKX_API_PASS as string;
const ON_CHAIN_DEST = '4';

class OkxClient extends RestClient {
  isReady: boolean;
  constructor(public credentials: APICredentials) {
    super(credentials);
    this.isReady = !!credentials.apiPass && !!credentials.apiKey && !!credentials.apiSecret;
  }

  async withdraw(params: WithdrawType) {
    const { coin, network, address, amount } = params;
    let fee: string | undefined;

    try {
      const currencies = await this.getCurrencies(coin);
      fee = currencies.find((currency) => currency.chain === `${coin.toUpperCase()}-${network.toUpperCase()}`)?.minFee;
    } catch (e) {
      throw new Error(`Unable to get fee: ${e}`);
    }

    if (!fee) {
      throw new Error('Unable to get fee');
    }

    const response = await super.submitWithdraw({
      ccy: coin,
      amt: String(amount),
      dest: ON_CHAIN_DEST,
      toAddr: address,
      chain: network,
      fee,
    });

    return {
      id: response[0].wdId,
    };
  }
}

export const okxClient = new OkxClient({
  apiKey: OKX_API_KEY,
  apiSecret: OKX_SECRET_KEY,
  apiPass: API_PASS,
});
