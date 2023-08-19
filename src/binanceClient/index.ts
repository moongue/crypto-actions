import dotenv from 'dotenv';
dotenv.config();

import { MainClient } from 'binance';

const API_KEY = process.env.BINANCE_API_KEY || 'xxx';
const API_SECRET = process.env.BINANCE_SECRET_KEY || 'xxx';

export default new MainClient({
  api_key: API_KEY,
  api_secret: API_SECRET,
});
