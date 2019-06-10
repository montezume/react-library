#!/usr/bin/env node

/* eslint-disable no-console */

'use strict';

const mri = require('mri');
const spawn = require('react-dev-utils/crossSpawn');

const flags = mri(process.argv.slice(2), { alias: { help: ['h'] } });
const commands = flags._;

if (commands.length === 0 || (flags.help && commands.length === 0)) {
  console.log(`
  Usage: scripts [command] [options]
  Commands:
  build            Bundles the library in production mode
  `);
  process.exit(0);
}

const command = commands[0];

switch (command) {
  case 'build': {
    const commandArgs = process.argv.slice(2).filter(arg => command !== arg);
    const result = spawn.sync(
      'node',
      [require.resolve(`../${command}`)].concat(commandArgs),
      {
        stdio: 'inherit',
      }
    );
    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
      } else if (result.signal === 'SIGTERM') {
        console.log(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
      }
      process.exit(1);
    }
    process.exit(result.status);
    break;
  }
}
