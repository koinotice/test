const path = require('path')
require('dotenv').config(
    {path: path.resolve(process.cwd(), 'env/.env')}
); // tslint:disable-line no-var-requires


import {WedexClient, HttpMethod, LogTypeValue} from 'wedex';

import {LiquidOrder} from './liu';

const me = process.env;
// console.log(me)
// const me = {
//
//     accountId: 5,
//     apiKey: "myphNyLr0NozZ1s80p7tJ9eF9CwHPfS6nntiwPchq685o3KtYKHDNriRCndUUTt4",
//
//
// }
//  console.log(me)
//
import {CancelOrder} from './cancelAll';
const liu = new LiquidOrder(me);
// @ts-ignore
const wedex = new WedexClient({
    account: me,
    logType: LogTypeValue.None,
    baseUrl: me.url

});

async function watch() {
    let data,data1
    try {


        //
        // data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
        // // //
        // const guabuy = await liu.guabuydan(data);
        // data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
        // const guasell = await liu.guaselldan(data);
        // data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
        // const lakai = await liu.lakaijulv(data);
        data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
        const liudong = await liu.liudong(data);
        //const liudong = await liu.liudong(data);


        // data1 = await wedex.Market.getOrderBook('LRC-USDT', 0, 0).toPromise();
        //
        //
        //  await liu.liudongUSDT(data1);
        //await cc.start(1)
        // data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
        // const reguq = await liu.regua();
        // data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
        // const cancel = await liu.cancelBuys();

    } catch (e) {
        console.log(e)
    } finally {
        watch();
    }

}




async function main(){

    await liu.init()
    // const cc=new CancelOrder(me)
    // cc.start(1)

    await watch();

}
main();
// //liu.regua()
//
// // //,  "types": ["deposit, onchainWithdrawal"
//  let i=0
// async function main(){
//     let sub = wedex.Request.custom(
//         HttpMethod.GET,
//         'http://13.112.139.43:31610/api/v1/user/deposits',
//         {"accountId":5,"offset":0,"limit":10},
//         true
//     )
//     console.log(i++)
//
//     let api = await sub.toPromise()
//     //console.log(api)
//     console.log(api.transactions[0] )
//     main()
//
// }
// main()

//setInterval(main, 5000)



