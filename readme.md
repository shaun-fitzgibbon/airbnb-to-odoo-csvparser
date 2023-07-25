# Airbnb CSV to Odoo CSV converter

Run Command

```sh
# BUG: Needs Fixing tsnode with esm
pnpm ts-node ./src/cli.ts parse -i ./data/input/input.csv -o ./data/output/

node --loader ts-node/esm  ./src/cli.ts parse -i ./data/input/input.csv -o ./data/output/

```
