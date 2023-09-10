import dotenv from 'dotenv';
dotenv.config();

import { MainClient, RestClientOptions } from 'binance';

const API_KEY = process.env.BINANCE_API_KEY as string;
const API_SECRET = process.env.BINANCE_SECRET_KEY as string;

class BinanceClient extends MainClient {
  isReady: boolean;
  constructor(options: RestClientOptions) {
    super(options);
    this.isReady = !!options.api_key && !!options.api_secret;
  }
}

export const binanceClient = new BinanceClient({
  api_key: API_KEY,
  api_secret: API_SECRET,
});
