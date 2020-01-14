const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const config = require('./config.json')
const secureConfig = require('./secure-config.json')
const fs = require('fs');
const web3 = new Web3(new Web3.providers.HttpProvider(secureConfig.web3Provider))

const addressFrom = secureConfig.address

// sign and send
// @param txData { nonce, gasLimit, gasPrice, to, from, value }
function sendSigned(txData, cb) {
    const privateKey = new Buffer(secureConfig.privKey, 'hex')
    const transaction = new Tx(txData)
    transaction.sign(privateKey)
    const serializedTx = transaction.serialize().toString('hex')
    web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}
var data=[]

function send(){
// get the nonce
    web3.eth.getTransactionCount(addressFrom).then(txCount => {
        data.forEach((eth, i) => {
            console.log(eth,i)
            const amount = web3.utils.toWei(eth.amount)

            const txData = {
                nonce: web3.utils.toHex(txCount + i),
                gasLimit: web3.utils.toHex(config.gasLimit),
                gasPrice: web3.utils.toHex(config.gasPrice),
                to: eth.address,
                from: addressFrom,
                value: web3.utils.toHex(amount)
            }

            // sign and send
            sendSigned(txData, function(err, result) {
                if (err) return console.log('error', err)
                console.log(`Sent ${amount} ETH to ${txData.to} in tx #${result}`)
            })
        })


    })
}





function main(){
// var csvStream1 = csv()
//     .on("data", function(dt){
//       data.push(dt)
//
//     })
//     .on("end", function(){
//       console.log("done");
//       csvStream.end();
//       send()
//
//     });
//
// stream.pipe(csvStream1);
    const csv = require('fast-csv');

    const fileStream = fs.createReadStream("bb.csv");
    const parser = csv.parse();

    fileStream
        .pipe(parser)
        .on('error', error => console.error(error))
        .on('readable', () => {
            for (let row = parser.read(); row; row = parser.read()) {
                // console.log(`ROW=${JSON.stringify(row)}`);
                dt={
                    address:row[0],
                    amount:row[1],
                }
                data.push(dt)
            }
        })
        .on('end', (rowCount) => send());

}

main()
