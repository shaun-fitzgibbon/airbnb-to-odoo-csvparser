import { convertAirbnbCsvToOdooFormat } from '../lib/fastcsv.js'

interface Arguments {
  inputFile: string
  outputFolder: string
}

export default async function (argv: Arguments) {
  convertAirbnbCsvToOdooFormat(argv.inputFile, argv.outputFolder)
}
