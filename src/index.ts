import inquirer from 'inquirer';
import controllerMapper from './controllers/index.js';

const choices = Object.keys(controllerMapper);

async function main() {
  const answer: { selectedAction: keyof typeof controllerMapper } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedAction',
      message: 'What do you want to do?',
      choices,
    },
  ]);

  const controller = controllerMapper[answer.selectedAction];

  await controller();
}

main();
