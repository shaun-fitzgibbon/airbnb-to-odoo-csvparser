#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import parse from './command/parse.js'

yargs(hideBin(process.argv))
    .scriptName('')
    .command(
        'parse',
        'Parse airbnb csv file into odoo format',
        {
            inputFile: {
                alias: 'i',
                describe: 'input .csv file to parse',
                demandOption: true,
                default: './data/input/input.csv',
                type: 'string',
            },
            outputFolder: {
                alias: 'o',
                describe: 'output folder path',
                demandOption: false,
                default: './data/output',
                type: 'string',
            },
        },
        parse
    )
    .help().argv
