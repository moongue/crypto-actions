import * as querystring from 'querystring';
import * as crypto from 'crypto';
import { removeEmptyValue } from '../../utils/removeEmptyValue.ts';
import { makeRequest } from '../../utils/makeRequest.ts';

class MexcClient {
  constructor(public options: { apiKey: string; apiSecret: string; baseURL?: string }) {
    this.options.baseURL = 'https://api.mexc.com/api/v3';
  }

  async publicRequest(method: 'get' | 'post' = 'get', path: string, params: any = {}) {
    const queryParams = querystring.stringify(removeEmptyValue(params));
    const url = `${this.options.baseURL}${path}?${queryParams}`;

    return makeRequest({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        'X-MEXC-APIKEY': this.options.apiKey,
      },
    });
  }

  private async privateRequest(method: 'get' | 'post' = 'get', path: string, params: Record<string, any> = {}) {
    const timestamp = Date.now();
    const queryParams = querystring.stringify({ ...removeEmptyValue(params), timestamp });
    const signature = crypto.createHmac('sha256', this.options.apiSecret).update(queryParams).digest('hex');
    const url = `${this.options.baseURL}${path}?${queryParams}&signature=${signature}`;

    return makeRequest({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        'X-MEXC-APIKEY': this.options.apiKey,
      },
    });
  }

  async withdraw(params: { coin: string; network: string; address: string; amount: number }) {
    const {
      data: { id },
    } = await this.privateRequest('post', '/capital/withdraw/apply', params);

    return {
      id,
    };
  }
}
export const mexcClient = new MexcClient({
  apiKey: process.env.MEXC_API_KEY || 'xxx',
  apiSecret: process.env.MEXC_SECRET_KEY || 'xxx',
});
