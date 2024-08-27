#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error);
    return false;
  }
  return true;
};

// Get the template name from the command line arguments or default to 'prisma'
const template = process.argv[2] || 'prisma';

(async () => {
  try {
    let repoName = await prompt('What would you like to name your project? (default: neon-app)\n');
    repoName = repoName || 'neon-app';

    let packageManager = await prompt('Which package manager would you like to use? (npm/yarn/pnpm) (default: npm)\n');
    packageManager = packageManager || 'npm';

    const gitCheckoutCommand = `git clone --depth 1 https://github.com/rohittcodes/neon-osskit-${template}.git ${repoName}`;

    console.log(`Creating a new Neon OSS Kit project in ${repoName}...`);
    const checkout = runCommand(gitCheckoutCommand);
    if (!checkout) {
      process.exit(-1);
    }

    console.log(`Installing dependencies...`);
    let installDepsCommand = '';
    switch (packageManager) {
      case 'npm':
        installDepsCommand = `cd ${repoName} && npm install`;
        break;
      case 'yarn':
        installDepsCommand = `cd ${repoName} && yarn`;
        break;
      case 'pnpm':
        installDepsCommand = `cd ${repoName} && pnpm install`;
        break;
      default:
        console.error(`Invalid package manager: ${packageManager}`);
        process.exit(-1);
    }

    const installDeps = runCommand(installDepsCommand);
    if (!installDeps) {
      process.exit(-1);
    }

    console.log(`Project ${repoName} created successfully! Follow the instructions in the README.md or visit https://osskit-neon.vercel.app for more information.\n`);
    console.log(`For now, you can run the following commands to start the development server:\n`);
    console.log(`cd ${repoName} && npm run dev\n`);

  } finally {
    rl.close(); // Ensure readline is closed after all operations
  }
})();
