import fs from "fs";
import chalk from 'chalk';
import { format as formatDate } from "date-fns";
import * as csv from "fast-csv";


type AirbnbRow = {
  Date: Date;
  Type: string;
  "Confirmation Code": string;
  "Start Date": Date;
  Nights: Number;
  Guest: string;
  Listing: string;
  Details: string;
  Reference: string;
  Currency: string;
  Amount: number;
  "Paid Out": number;
  "Host Fee": number;
  "Cleaning Fee": number;
  "Gross Earnings": number;
};

type OdooRow = {
  id: string | null;
  name: string | null;
  partner_id: "Airbnb" | null;
  invoice_date: string | null;
  invoice_date_due: string | null;
  ref: string | null;
  activity_ids: string | null;
  "invoice_line_ids/product_id":
    | "[AIRBNB] Airbnb Rental"
    | "[HOST] Hosting Fee"
    | "[CLEANING] Cleaning Fee";
  "invoice_line_ids/account_id":
    | "200000 Rental Income"
    | "210000 Hosting Fee"
    | "200005 Cleaning Services Income";
  "invoice_line_ids/quantity": number;
  "invoice_line_ids/product_uom_id": "Unit(s)";
  "invoice_line_ids/price_unit": number;
  "invoice_line_ids/tax_ids": "No VAT (Sales)";
  Listing: string | null;
  Currency: string | null;
};

export async function convertAirbnbCsvToOdooFormat(
  inputFileCsv: string,
  outputFolder: string,
) {
  let list: { [keys: string]: OdooRow[] } = {};

  const readStream = fs.createReadStream(inputFileCsv);

  csv.parseStream(readStream, { ignoreEmpty: true, headers: true })
    .on("error", (error: Error) => console.error(error))
    .on("data", (row: AirbnbRow): void => {
      const newOdooRows: OdooRow[] = [
        {
          /*
           * AIRBNB RENTAL
           */
          id: row["Confirmation Code"]+"_"+ formatDate(new Date(row.Date), "yyyy-MM-dd"),
          name: null,
          partner_id: "Airbnb",
          invoice_date: formatDate(new Date(row.Date), "yyyy-MM-dd"),
          invoice_date_due: formatDate(new Date(row.Date), "yyyy-MM-dd"),
          ref: row.Guest,
          activity_ids: "",
          "invoice_line_ids/product_id": "[AIRBNB] Airbnb Rental",
          "invoice_line_ids/account_id": "200000 Rental Income",
          "invoice_line_ids/quantity": 1,
          "invoice_line_ids/product_uom_id": "Unit(s)",
          "invoice_line_ids/price_unit":
            (Number(row.Amount) +
              Number(row["Host Fee"]) -
              Number(row["Cleaning Fee"])),
          "invoice_line_ids/tax_ids": "No VAT (Sales)",
          Listing: row.Listing,
          Currency: row.Currency,
        },
        {
          /*
           * HOST FEE
           */
          id: null,
          name: null,
          partner_id: null,
          invoice_date: null,
          invoice_date_due: null,
          ref: null,
          activity_ids: null,
          "invoice_line_ids/product_id": "[HOST] Hosting Fee",
          "invoice_line_ids/account_id": "210000 Hosting Fee",
          "invoice_line_ids/quantity": 1,
          "invoice_line_ids/product_uom_id": "Unit(s)",
          "invoice_line_ids/price_unit": Number(row["Host Fee"] * -1),
          "invoice_line_ids/tax_ids": "No VAT (Sales)",
          Listing: null,
          Currency: null,
        },
        {
          /*
           * CLEANING FEE
           */
          id: null,
          name: null,
          partner_id: null,
          invoice_date: null,
          invoice_date_due: null,
          ref: null,
          activity_ids: null,
          "invoice_line_ids/product_id": "[CLEANING] Cleaning Fee",
          "invoice_line_ids/account_id": "200005 Cleaning Services Income",
          "invoice_line_ids/quantity": 1,
          "invoice_line_ids/product_uom_id": "Unit(s)",
          "invoice_line_ids/price_unit": Number(row["Cleaning Fee"]),
          "invoice_line_ids/tax_ids": "No VAT (Sales)",
          Listing: null,
          Currency: null,
        },
      ];

      const airbnbListing = row.Listing;
      if (!list[airbnbListing]) {
        list[airbnbListing] = [];
      }
      list[airbnbListing].push(...newOdooRows);
    })
    .on("end", () => {
      Object.keys(list).map((key) => {
        const filename = key.replace(/ /g, "_") + ".csv";
        const value = list[key];

        csv.writeToPath(outputFolder + "/" + filename, value, {
          headers: true,
        })
          .on("error", (error: Error) => console.error(error))
          .on("finish", () => console.info(`${chalk.blue('Created:')} ${filename}`))
      });
    });
}
