import { convertAirbnbCsvToOdooFormat } from '../lib/fastcsv'

interface Arguments {
  inputFile: string
  outputFile: string
}

export default async function (argv: Arguments) {
  convertAirbnbCsvToOdooFormat(argv.inputFile, argv.outputFile)
}
