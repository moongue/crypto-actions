import inquirer from 'inquirer';
import path from 'path';
// import bClient from '../binanceClient/index.ts';
import { fileWithAddressesParser } from '../parsers/index.ts';

// function cliPrettyInterface() {
// }

export default async function withdrawToMultipleController() {
  const csvFile: { path: string } = await inquirer.prompt([
    {
      type: 'input',
      name: 'path',
      message: 'Enter path to csv file with withdraw addresses:',
    },
  ]);
  const fullPath = path.join(process.cwd(), csvFile.path);

  fileWithAddressesParser(fullPath);
}
