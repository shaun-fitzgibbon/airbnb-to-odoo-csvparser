#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import parse from './command/parse'

yargs(hideBin(process.argv))
  .scriptName('')
  .command(
    'parse',
    'Parse csv file into odoo format',
    {
      inputFile: {
        alias: 'i',
        describe: '.csv file to parse',
        demandOption: true,
        default: '../output/input.csv',
        type: 'string',
      },
      outputFile: {
        alias: 'o',
        describe: 'output file path',
        demandOption: true,
        default: '../output/output.csv',
        type: 'string',
      },
    },
    parse
  )
  .help().argv

// require('yargs')
//   .scriptName('shauncli')
//   .usage('$0 <cmd> [args]')
//
