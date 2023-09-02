import * as querystring from 'querystring';
import axios from 'axios';
import { removeEmptyValue } from '../../utils/removeEmptyValue.ts';

class MexcClient {
  constructor(public options: { apiKey: string; apiSecret: string; baseURL?: string }) {
    this.options.baseURL = 'https://api.mexc.com/api/v3';
  }

  private async publicRequest(method: 'get' | 'post' = 'get', path: string, paramsObj: any = {}) {
    const params = querystring.stringify(removeEmptyValue(paramsObj));
    const url = `${this.options.baseURL}${path}?${params}`;

    return await axios[method](url, {
      headers: {
        'Content-Type': 'application/json',
        'X-MXC-APIKEY': this.options.apiKey,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async withdraw({ coin, network, address, amount }: { coin: string; network: string; address: string; amount: number }) {
    return {
      id: '123',
    };
  }
}
export const mexcClient = new MexcClient({
  apiKey: process.env.MEXC_API_KEY || 'xxx',
  apiSecret: process.env.MEXC_SECRET_KEY || 'xxx',
});
