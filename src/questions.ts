import { clients, ClientsType } from './clients/index.ts';
import inquirer from 'inquirer';
import fs from 'fs';

export const questions = {
  confirm: {
    isConfirmed: async (message: string) => {
      const { isConfirmed }: { isConfirmed: boolean } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'isConfirmed',
          message,
        },
      ]);

      return isConfirmed;
    },
  },
  list: {
    client: async () => {
      const { client }: { client: ClientsType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'client',
          message: 'Select client:',
          choices: Object.keys(clients),
        },
      ]);

      return client;
    },
  },
  input: {
    filePath: async () => {
      const { filePath }: { filePath: string } = await inquirer.prompt([
        {
          type: 'input',
          name: 'filePath',
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
      return filePath;
    },
    interval: async () => {
      const { interval }: { interval: string } = await inquirer.prompt([
        {
          type: 'input',
          name: 'interval',
          message: 'Enter interval between withdraws in seconds:',
          validate: (value) => {
            if (Number.isNaN(Number(value))) {
              return 'Interval must be a number';
            }
            return true;
          },
        },
      ]);

      return interval;
    },
    coin: async () => {
      const { coin }: { coin: string } = await inquirer.prompt([
        {
          type: 'input',
          name: 'coin',
          message: 'Enter coin ticker:',
          validate: (value) => {
            if (!value) {
              return 'Coin ticker is required';
            }
            return true;
          },
        },
      ]);

      return coin;
    },
    network: async () => {
      const { network }: { network: string } = await inquirer.prompt([
        {
          type: 'input',
          name: 'network',
          message: 'Enter network:',
          validate: (value) => {
            if (!value) {
              return 'Network is required';
            }
            return true;
          },
        },
      ]);

      return network;
    },
    amount: async () => {
      const { amount }: { amount: string } = await inquirer.prompt([
        {
          type: 'input',
          name: 'amount',
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

      return amount;
    },
  },
};
