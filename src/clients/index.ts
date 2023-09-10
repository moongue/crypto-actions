import { binanceClient } from './binanceClient/index.ts';
import { mexcClient } from './mexcClient/index.ts';
import { okxClient } from './okxClient/index.ts';

export const clients = {
  binance: binanceClient,
  mexc: mexcClient,
  okx: okxClient,
};

export type ClientsType = keyof typeof clients;
export type ClientsInterfacesType = (typeof clients)[ClientsType];
