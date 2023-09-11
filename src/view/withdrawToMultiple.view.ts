import path from 'path';
import chalk from 'chalk';
import { clients, ClientsType } from '../clients/index.ts';
import { fileWithAddressesParser } from '../parsers/index.ts';
import { WithdrawType, withdrawToMultipleController, CompletedWithdrawType } from '../controllers/withdrawToMultiple.controller.ts';
import { questions } from '../questions.ts';

const styles = {
  pending: (str: string) => chalk.yellow(str),
  success: (str: string) => chalk.green(str),
  failed: (str: string) => chalk.red(str),
  waiting: (str: string) => chalk.blue(str),
};

export const drawCliPrettyWithdrawInterface = (withdraws: Array<WithdrawType | CompletedWithdrawType>) => {
  process.stdout.cursorTo(0);
  process.stdout.write('\x1Bc');

  process.stdout.write(`
${withdraws
  .map(
    (withdraw, idx) =>
      `${idx + 1}: ${withdraw.address}${
        withdraw.state === 'success' ? ` (transaction hash: ${withdraw?.transactionHash}, amount: ${withdraw.amount})` : ''
      } - ${styles[withdraw.state](withdraw.state)} \n`,
  )
  .join('')}
  `);
};

export const withdrawToMultipleView = async () => {
  let client: ClientsType;
  let filePath: string;
  let interval: number;
  let coin: string;
  let network: string;
  let amount: string;
  let isConfirmed = false;

  do {
    client = await questions.list.client();

    if (!clients[client].isReady) {
      throw new Error('Client is not ready, please check your .env file');
    }

    filePath = await questions.input.filePath();
    interval = Number(await questions.input.interval());
    coin = await questions.input.coin();
    network = await questions.input.network();
    amount = await questions.input.amount();
    isConfirmed = await questions.confirm.isConfirmed(
      `Check your data: \nPath to csv file with withdraw addresses: ${filePath} \nInterval between withdraws in seconds: ${interval} \nCoin ticker: ${coin} \nNetwork: ${network} \nAmount: ${amount} \n`,
    );
  } while (!isConfirmed);

  const fullPath = path.join(process.cwd(), filePath);

  const records = fileWithAddressesParser(fullPath);

  const intervalInMs = Number(interval) * 1000;

  const withdrawsStates: WithdrawType[] = records.map((record) => ({
    address: record,
    network,
    coin,
    amount,
    state: 'pending',
  }));

  await withdrawToMultipleController(drawCliPrettyWithdrawInterface)(withdrawsStates, client, intervalInMs);

  console.log('All withdraws completed');
  process.exit(0);
};
