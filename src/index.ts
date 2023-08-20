import inquirer from 'inquirer';
import { views } from './view/index.ts';

const choices = Object.keys(views);

async function main() {
  const answer: { selectedAction: keyof typeof views } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedAction',
      message: 'What do you want to do?',
      choices,
    },
  ]);

  const view = views[answer.selectedAction];

  await view();
}

main();
