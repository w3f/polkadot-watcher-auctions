[![CircleCI](https://circleci.com/gh/w3f/polkadot-watcher-auctions.svg?style=svg)](https://circleci.com/gh/w3f/polkadot-watcher-auctions)

# polkadot-watcher-csv-exporter

## Please Note
All the relevant data model code is placed in [writeDataCSV](src/writeDataCSV.ts).  

## How to Run 

### Requirements
- yarn: https://classic.yarnpkg.com/en/docs/install/

```bash
git clone https://github.com/w3f/polkadot-watcher-auctions.git
cd polkadot-watcher-auctions
cp config/main.sample.yaml config/main.yaml 
#just the first time

yarn
yarn build
yarn start
```

## Output
The default configuration will create a ./data-csv folder that will be populated with the chain data 