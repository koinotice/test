const BigNumber = require('bignumber.js');
const csv = require('fast-csv');
const fs = require('fs');
const data = []
import {
    common,
    config,
    ethereum,
    exchange,
    Account,
    ContractUtils,
    EthRpcUtils,
    Utils
} from './lightcone';

import {getOrderId, getNonce} from "../src/pkg/LightconeAPI";

var Web3 = require('web3');
const prourl = "https://mainnet.infura.io/v3/cabc724fb9534d1bb245582a74ccf3e7"
const web3 = new Web3(new Web3.providers.HttpProvider(prourl))

function send() {
    const gasPrice = common.formatter.toGWEI(
        10000000000
    );
    let pkAccount = ethereum.account.fromPrivateKey(
        "3a3aec7d0577736f3db2de6b5aceea350b7310fc83141835f88ce1221fc85932",
    );
    let account = new Account(pkAccount);

    console.log(account)
    const address = pkAccount.getAddress()
    web3.eth.getTransactionCount(address).then(async txCount => {

        for (const [i, token] of data.entries()) {
            console.log(token, i)

            let a =await account.depositTo(token.address,
                "LRC", token.amount, txCount + i, gasPrice.toNumber())

            console.log(a)
            web3.eth.sendSignedTransaction(a, (err, result) => {
                if (err) return console.log('error', err)
                console.log(`Sent ${token.amount} ETH to ${token.address} in tx #${result}`)
            })
        }



    })
}


function main() {

    const fileStream = fs.createReadStream("caidan.csv");
    const parser = csv.parse();

    fileStream
        .pipe(parser)
        .on('error', error => console.error(error))
        .on('readable', () => {
            for (let row = parser.read(); row; row = parser.read()) {
                // console.log(`ROW=${JSON.stringify(row)}`);
                let dt = {
                    address: row[0],
                    amount: row[1],
                }
                data.push(dt)
            }
        })
        .on('end', (rowCount) => send());

}

main()
