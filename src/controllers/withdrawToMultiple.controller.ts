import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import { fileWithAddressesParser } from '../parsers/index.ts';
import sleep from '../utils/sleep.js';

type WithdrawState = {
  address: string;
  state: 'pending' | 'success' | 'failed' | 'waiting';
};

const styles = {
  pending: (str: string) => chalk.yellow(str),
  success: (str: string) => chalk.green(str),
  failed: (str: string) => chalk.red(str),
  waiting: (str: string) => chalk.blue(str),
};

const drawCliPrettyInterface = (withdraws: WithdrawState[]) => {
  process.stdout.cursorTo(0);
  process.stdout.write('\x1Bc');

  process.stdout.write(`
${withdraws.map((withdraw, idx) => `${idx + 1}: ${withdraw.address} - ${styles[withdraw.state](withdraw.state)} \n`).join('')}
  `);
};

const processWithdraw = async (withdraw: WithdrawState) => {
  return {
    ...withdraw,
    state: 'success',
  } as const;
};

export default async function withdrawToMultipleController() {
  const csvFile: { path: string } = await inquirer.prompt([
    {
      type: 'input',
      name: 'path',
      message: 'Enter path to csv file with withdraw addresses:',
    },
  ]);
  const fullPath = path.join(process.cwd(), csvFile.path);

  const records = fileWithAddressesParser(fullPath);

  const interval: { interval: string } = await inquirer.prompt([
    {
      type: 'input',
      name: 'interval',
      message: 'Enter interval between withdraws in seconds:',
    },
  ]);

  const intervalInMs = Number(interval.interval) * 1000;

  const withdrawsStates: WithdrawState[] = records.map((record) => ({
    address: record,
    state: 'pending',
  }));

  for (let index = 0; index < withdrawsStates.length; index++) {
    withdrawsStates[index] = await processWithdraw(withdrawsStates[index]);

    if (index + 1 < withdrawsStates.length) {
      withdrawsStates[index + 1] = {
        ...withdrawsStates[index + 1],
        state: 'waiting',
      };
    }

    drawCliPrettyInterface(withdrawsStates);
    await sleep(intervalInMs);
  }
}
