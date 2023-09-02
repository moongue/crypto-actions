import { binanceClient } from './binanceClient/index.ts';
import { mexcClient } from './mexcClient/index.ts';

export const clients = {
  binance: binanceClient,
  mexc: mexcClient,
};

export type ClientsType = keyof typeof clients;
export type ClientsInterfacesType = (typeof clients)[ClientsType];
