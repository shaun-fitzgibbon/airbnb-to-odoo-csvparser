import fs from 'fs'
import { format as formatDate } from 'date-fns'
import { writeToPath } from '@fast-csv/format'
import { parse } from '@fast-csv/parse'

type AirbnbRow = {
  Date: Date
  Type: string
  'Confirmation Code': string
  'Start Date': Date
  Nights: Number
  Guest: string
  Listing: string
  Details: string
  Reference: string
  Currency: string
  Amount: number
  'Paid Out': number
  'Host Fee': number
  'Cleaning Fee': number
  'Gross Earnings': number
}

type OdooRow = {
  'Invoice Partner Display Name': string
  'Invoice/Bill Date': string
  Reference: string
  'Invoice lines/Partner': string
  'Invoice lines/Date': string
  'Invoice lines/Reference': string
  'Invoice lines/Product': string
  'Invoice lines/Quantity': number
  'Invoice lines/Unit Price': number
  'Invoice lines/Total': number
  'Invoice lines/Status': 'DRAFT' | 'POSTED'
  Total: number
  Status: 'DRAFT' | 'POSTED'
  Listing: string
  Currency: string
  'Host Fee': number
  'Cleaning Fee': number
  'Gross Earnings': number
}

export async function convertAirbnbCsvToOdooFormat(
  inputFileCsv: string,
  outputFileCsv: string
) {
  let results: OdooRow[] = []

  const readStream = fs.createReadStream(inputFileCsv)
  const writeStream = fs.createWriteStream(outputFileCsv)

  const parseData = parse({
    ignoreEmpty: true,
    headers: true,
  })

  readStream
    .pipe(parseData)
    .on('error', (error) => console.error(error))
    .on('data', (row: AirbnbRow): void => {
      const newJSON: OdooRow[] = [
        {
          'Invoice Partner Display Name': 'Airbnb',
          'Invoice/Bill Date': formatDate(new Date(row.Date), 'yyyy-MM-dd'),
          Reference: row.Guest,
          'Invoice lines/Partner': 'Airbnb',
          'Invoice lines/Date': formatDate(new Date(row.Date), 'yyyy-MM-dd'),
          'Invoice lines/Reference': row.Guest,
          'Invoice lines/Product': '[AIRBNB] Airbnb Rental',
          'Invoice lines/Quantity': Number(row.Nights),
          'Invoice lines/Unit Price':
            (Number(row.Amount) +
              Number(row['Host Fee']) -
              Number(row['Cleaning Fee'])) /
            Number(row.Nights),
          'Invoice lines/Total':
            Number(row.Amount) +
            Number(row['Host Fee']) -
            Number(row['Cleaning Fee']),
          'Invoice lines/Status': 'DRAFT',
          Total: Number(row.Amount),
          Status: 'DRAFT',
          Listing: row.Listing,
          Currency: row.Currency,
          'Host Fee': Number(row['Host Fee'] * -1),
          'Cleaning Fee': Number(row['Cleaning Fee']),
          'Gross Earnings': Number(row['Gross Earnings']),
        },
        {
          'Invoice Partner Display Name': 'Airbnb',
          'Invoice/Bill Date': formatDate(new Date(row.Date), 'yyyy-MM-dd'),
          Reference: row.Guest,
          'Invoice lines/Partner': 'Airbnb',
          'Invoice lines/Date': formatDate(new Date(row.Date), 'yyyy-MM-dd'),
          'Invoice lines/Reference': row.Guest,
          'Invoice lines/Product': '[AIRBNB] Airbnb Rental',
          'Invoice lines/Quantity': Number(row.Nights),
          'Invoice lines/Unit Price':
            (Number(row.Amount) +
              Number(row['Host Fee']) -
              Number(row['Cleaning Fee'])) /
            Number(row.Nights),
          'Invoice lines/Total':
            Number(row.Amount) +
            Number(row['Host Fee']) -
            Number(row['Cleaning Fee']),
          'Invoice lines/Status': 'DRAFT',
          Total: Number(row.Amount),
          Status: 'DRAFT',
          Listing: row.Listing,
          Currency: row.Currency,
          'Host Fee': Number(row['Host Fee'] * -1),
          'Cleaning Fee': Number(row['Cleaning Fee']),
          'Gross Earnings': Number(row['Gross Earnings']),
        },
        {
          'Invoice Partner Display Name': 'Airbnb',
          'Invoice/Bill Date': formatDate(new Date(row.Date), 'yyyy-MM-dd'),
          Reference: row.Guest,
          'Invoice lines/Partner': 'Airbnb',
          'Invoice lines/Date': formatDate(new Date(row.Date), 'yyyy-MM-dd'),
          'Invoice lines/Reference': row.Guest,
          'Invoice lines/Product': '[AIRBNB] Airbnb Rental',
          'Invoice lines/Quantity': Number(row.Nights),
          'Invoice lines/Unit Price':
            (Number(row.Amount) +
              Number(row['Host Fee']) -
              Number(row['Cleaning Fee'])) /
            Number(row.Nights),
          'Invoice lines/Total':
            Number(row.Amount) +
            Number(row['Host Fee']) -
            Number(row['Cleaning Fee']),
          'Invoice lines/Status': 'DRAFT',
          Total: Number(row.Amount),
          Status: 'DRAFT',
          Listing: row.Listing,
          Currency: row.Currency,
          'Host Fee': Number(row['Host Fee'] * -1),
          'Cleaning Fee': Number(row['Cleaning Fee']),
          'Gross Earnings': Number(row['Gross Earnings']),
        },
      ]

      results.push(...newJSON)
    })
    .on('end', () => {
      writeToPath(outputFileCsv, results)
        .on('error', (err) => console.error(err))
        .on('finish', () => console.info('Converting Airbnb to Odoo, Complete'))
    })
}
