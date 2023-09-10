import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { clients, ClientsType } from '../clients/index.ts';
import { fileWithAddressesParser } from '../parsers/index.ts';
import { WithdrawType, withdrawToMultipleController, CompletedWithdrawType } from '../controllers/withdrawToMultiple.controller.ts';
import chalk from 'chalk';

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
    const { clientAnswer }: { clientAnswer: ClientsType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'clientAnswer',
        message: 'Select client:',
        choices: Object.keys(clients),
      },
    ]);
    client = clientAnswer;

    if (!clients[client].isReady) {
      throw new Error('Client is not ready, please check your .env file');
    }

    const { filePathAnswer }: { filePathAnswer: string } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePathAnswer',
        message: 'Enter path to csv file with withdraw addresses:',
        validate: (value) => {
          if (!value) {
            return 'Path is required';
          }
          if (!fs.statSync(value).isFile()) {
            return 'Path must be a file';
          }
          return true;
        },
      },
    ]);
    filePath = filePathAnswer;

    const { intervalAnswer }: { intervalAnswer: string } = await inquirer.prompt([
      {
        type: 'input',
        name: 'intervalAnswer',
        message: 'Enter interval between withdraws in seconds:',
        validate: (value) => {
          if (Number.isNaN(Number(value))) {
            return 'Interval must be a number';
          }
          return true;
        },
      },
    ]);
    interval = Number(intervalAnswer);

    const { coinAnswer }: { coinAnswer: string } = await inquirer.prompt([
      {
        type: 'input',
        name: 'coinAnswer',
        message: 'Enter coin ticker:',
        validate: (value) => {
          if (!value) {
            return 'Coin ticker is required';
          }
          return true;
        },
      },
    ]);
    coin = coinAnswer;

    const { networkAnswer }: { networkAnswer: string } = await inquirer.prompt([
      {
        type: 'input',
        name: 'networkAnswer',
        message: 'Enter network:',
        validate: (value) => {
          if (!value) {
            return 'Network is required';
          }
          return true;
        },
      },
    ]);
    network = networkAnswer;

    const { amountAnswer }: { amountAnswer: string } = await inquirer.prompt([
      {
        type: 'input',
        name: 'amountAnswer',
        message:
          'You can enter range of amounts in format: 0.1-0.5 and script will generate random amount in this range for each withdraw. Enter amount:',
        validate: (value) => {
          if (!value) {
            return 'Amount is required';
          }
          if (value.split('-').length === 2) {
            const diapason = value.split('-');
            if (Number.isNaN(Number(diapason[0])) || Number.isNaN(Number(diapason[1]))) {
              return 'Interval must be a number or diapason';
            }
            return true;
          }

          if (Number.isNaN(Number(value))) {
            return 'Interval must be a number or diapason';
          }
          return true;
        },
      },
    ]);
    amount = amountAnswer;

    const { isConfirmedAnswer }: { isConfirmedAnswer: boolean } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isConfirmedAnswer',
        message: `Check your data: \nPath to csv file with withdraw addresses: ${filePath} \nInterval between withdraws in seconds: ${interval} \nCoin ticker: ${coin} \nNetwork: ${network} \nAmount: ${amount} \n`,
      },
    ]);
    isConfirmed = isConfirmedAnswer;
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
