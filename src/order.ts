require('dotenv').config(); // tslint:disable-line no-var-requires

const BigNumber = require('bignumber.js');
const rn = require('random-number');

import {WedexClient, HttpMethod, LogTypeValue} from 'wedex';
import {Account, ethereum, Utils as lightConeUtils} from "../src/dist";
import {getOrderId, lightconeGetAccount} from "../src/pkg/LightconeAPI";
import {CancelOrder} from "./cancelAll";
import {TradeOrder} from "./trade";


function randomNum(maxNum, minNum, decimalNum) {
    var max = 0, min = 0;
    minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum);
    switch (arguments.length) {
        case 1:
            return Math.floor(Math.random() * (max + 1));
            // @ts-ignore
            break;
        case 2:
            return Math.floor(Math.random() * (max - min + 1) + min);
            // @ts-ignore
            break;
        case 3:
            return (Math.random() * (max - min) + min).toFixed(decimalNum);
            // @ts-ignore
            break;
        default:
            return Math.random();
            // @ts-ignore
            break;
    }
}

const me = process.env
// const me = {
//
//     accountId: 6,
//     apiKey: "9g5yfCKZ2Te32gowBiNLnpKIzF1c8cKJJD3p1SbhobMrztG4U91gAaUL347xx8NK",
//     publicKeyX: "3501324891198957554132628643173442720600384144329795367825998979153234852538",
//     publicKeyY: "1766402079010850852187834001018371362373496144980902458610011105747896567662",
//     secret: "68191519"
//
// }
//console.log(me)
//

function aa(a){

}
// @ts-ignore
const wedex = new WedexClient({
    account: me,
    logType: LogTypeValue.None,
    logWriter: aa
});
const trade = new TradeOrder(me)
const cancelbot = new CancelOrder(me)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function getAmount(amount) {
    return new BigNumber(amount).div(1e18).toString(10)

}

const options = {
    min: 50
    , max: 1000
    , integer: true,
};


let price = 0.00028;
let price_up = 0.00017;
let price_down = 0.00013;
let price1 =   0.00008;
let price_in = 0.000001

let price_ding=0.000163;
//
let i=1
async function watchPrice(data) {

    console.log(data)
    const sell1 = data.Asks[0]
    console.log(sell1)

    let sp = 0
    if (!sell1) {
        sp = price
    } else {
        sp = Number(sell1.Price)
    }
    sp = price
    sp  = price_up+price_in*i
    i++
    console.log("sell1",Number(sell1.Price),sp)
    if (sp > price_up) {
        const sorder = {
            amount: rn(options),
            price: sp.toFixed(8),
        };
        console.log("sell",sorder)
        await trade.sellOrder(sorder);

    }
    // else if (sp < price_up && sp > price_down) {
    //     const sorder = {
    //         amount: parseInt(getAmount(sell1.Size)),
    //         price: sell1.Price,
    //     };
    //
    //     await buyOrder(sorder);
    // }
    // sleep(2000)
    // const buy1 = data.Bids[1]
    // let bp = 0
    // if (!buy1) {
    //     bp = price1
    // } else {
    //     bp = Number(buy1.Price)
    // }
    // bp = price1
    //
    // bp += price_in+price_in*i
    // console.log("buy1",Number(buy1.Price),bp)
    //
    // if (bp < price_down) {
    //
    //     const border = {
    //         amount: rn(options),
    //         price: bp.toFixed(8),
    //     };
    //     console.log("buy",border)
    //     await trade.buyOrder(border);
    //
    // }
    // else if (bp > price_down && bp < price_up) {
    //     const sorder = {
    //         // tslint:disable-next-line:radix
    //         amount: parseInt(getAmount(buy1.Size)),
    //         price: buy1.Price,
    //     };
    //
    //     await sellOrder(sorder);
    // }

}
const orders=[]
const orderb=[]
//买一卖一机器人
async function liquid(data) {
    //await cancelAll()
    const sell1 = data.Asks[0]
    const buy1 = data.Bids[0]
    const balance=await wedex.Wallet.getWalletBalances().toPromise()
    const ethCanBalance=getAmount(balance[0].totalAmount.minus(balance[0].frozenAmount))
    console.log(balance,ethCanBalance)

    const pricecha = (Number(sell1.Price) - Number(buy1.Price)).toFixed(8)
    console.log("pricecha", pricecha, sell1.Price, buy1.Price)

    // @ts-ignore
    

    // if (pricecha > 0.000008) {

        const targetPrice = randomNum(Number(buy1.Price), Number(sell1.Price), 8)
        const targetAmount = randomNum(40, 3000, 0)
        const sorder = {
            amount: targetAmount,
            price: targetPrice,
        };
        // const liquidTime = randomNum(1000, 50000, 4)
        // console.log("liquidTime sleep:", liquidTime)
        try{
            const buy = await trade.sellOrder(sorder) 
            orderb.push(buy.orderHash)
            console.log("buy",buy)
            // await sleep(2000)
            const sell = await trade.buyOrder(sorder) 
            console.log("sell",sell)
            orders.push(sell.orderHash)
        }catch(e){
            console.log("eeee",e)
        }

        console.log(orders,orderb)
        for (const [index, order] of orders.entries()) {
          
            if (order.status == "processing") {
                const res = await wedex.Trade.cancelOrder({
                    // "accountId": 11,
                    "orderHash": order.hash,
                    "clientOrderId": order.hash
                }).toPromise()
                console.log(`Received Todo :`, res);

            }

        }

        for (const [index, order] of orderb.entries()) {
          
            if (order.status == "processing") {
                const res = await wedex.Trade.cancelOrder({
                    // "accountId": 11,
                    "orderHash": order.hash,
                    "clientOrderId": order.hash
                }).toPromise()
                console.log(`Received Todo :`, res);

            }

        }
 
       

        // if (Math.random() > 0.5) {
        //     const targetAmount = randomNum(40, 3000, 0)
        //     const sorder = {
        //         amount: targetAmount,
        //         price: sell1.Price-price_in,
        //     };
        //     const buy = await trade.sellOrder(sorder);

        // }  else{
        //     const targetAmount = randomNum(40, 3000, 0)
        //     const sorder = {
        //         amount: targetAmount,
        //         price: buy1.Price+price_in,
        //     };
        //     const buy = await trade.buyOrder(sorder);

        // }
        console.log("流动",sorder)
   // }else{
        //if(ethCanBalance>5){
        //     const targetPrice =Number(sell1.Price)
        //     const targetAmount =  randomNum(40, 3000, 0)
        //     const sorder = {
        //         amount: targetAmount,
        //         price: targetPrice,
        //     };
        //     const buy = await trade.buyOrder(sorder);
        //     console.log("拉盘",sorder)
        //
        // }else{
            // const targetPrice =Number(buy1.Price)
            // const targetAmount =  randomNum(1000, 3000, 0)
            // const sorder = {
            //     amount: targetAmount,
            //     price: targetPrice,
            // };
            // const buy = await trade.sellOrder(sorder);
            // console.log("砸盘",sorder)
            // cancelbot.start(10)


       // }



   // }


}



//买一卖一机器人
async function liquid22(data) {
    //await cancelAll()
    const sell1 = data.Asks[0]
    const buy1 = data.Bids[0]
    const balance=await wedex.Wallet.getWalletBalances().toPromise()
    const ethCanBalance=getAmount(balance[0].totalAmount.minus(balance[0].frozenAmount))
    console.log(balance,ethCanBalance)

    const pricecha = (Number(sell1.Price) - Number(buy1.Price)).toFixed(8)
    console.log("pricecha", pricecha, sell1.Price, buy1.Price)

    // @ts-ignore
    if (pricecha > 0.000001*5) {

        const targetPrice = randomNum(Number(buy1.Price), Number(sell1.Price), 8)
        const targetAmount = randomNum(40, 3000, 0)
        const sorder = {
            amount: targetAmount,
            price: targetPrice,
        };
        const liquidTime = randomNum(1000, 50000, 4)
        console.log("liquidTime sleep:", liquidTime)

        const buy = await trade.sellOrder(sorder);
        await sleep(liquidTime)
        const sell = await trade.buyOrder(sorder);
        if (Math.random() > 0.5) {
            const targetAmount = randomNum(40, 3000, 0)
            const sorder = {
                amount: targetAmount,
                price: sell1.Price-price_in,
            };
            const buy = await trade.sellOrder(sorder);

        }  else{
            const targetAmount = randomNum(40, 3000, 0)
            const sorder = {
                amount: targetAmount,
                price: buy1.Price+price_in,
            };
            const buy = await trade.buyOrder(sorder);

        }
        console.log("流动",sorder)
    }else{
        if(ethCanBalance>15){
        //     const targetPrice =Number(sell1.Price)
        //     const targetAmount =  randomNum(40, 3000, 0)
        //     const sorder = {
        //         amount: targetAmount,
        //         price: targetPrice,
        //     };
        //     const buy = await trade.buyOrder(sorder);
        //     console.log("拉盘",sorder)
        //
        // }else{
            const targetPrice =Number(buy1.Price)
            const targetAmount =  randomNum(1000, 3000, 0)
            const sorder = {
                amount: targetAmount,
                price: targetPrice,
            };
            const buy = await trade.sellOrder(sorder);
            console.log("砸盘",sorder)
            cancelbot.start(10)


        }



    }


}

//买一卖一机器人
async function dingPrice(data) {
    let sub = wedex.Request.custom(
        HttpMethod.GET,
        'http://13.112.139.43:31610/api/v1/trade',
        {"market": "LRC-ETH",
            "fromId": 0,
            "limit": 0,},
        false
    )

    let api = await sub.toPromise()
    let od=api.trades[0]
    console.log(od)
    let timeprice=Number(od.price).toFixed(8)

    // @ts-ignore
    console.log(timeprice>price_ding-price_in*5,timeprice,price_ding,price_in*5,price_ding-price_in*5)
    // @ts-ignore
    if(timeprice<price_ding-price_in*5   ){
                const targetAmount = randomNum(40, 3000, 0)
                const sorder = {
                    amount: targetAmount,
                    price: price_ding,
                };
                const buy = await trade.buyOrder(sorder);

                console.log("ding buy",sorder)
    }

    // @ts-ignore
    if(timeprice>price_ding+price_in*5   ){
                const targetAmount = randomNum(40, 3000, 0)
                const sorder = {
                    amount: targetAmount,
                    price: price_ding,
                };
                const buy = await trade.sellOrder(sorder);

        console.log("ding sell",sorder)

    }

    console.log(timeprice)
    // const balance=await wedex.Wallet.getWalletBalances().toPromise()
    // const ethCanBalance=getAmount(balance[0].totalAmount.minus(balance[0].frozenAmount))
    // console.log(balance,ethCanBalance)
    //
    // const pricecha = (Number(sell1.Price) - Number(buy1.Price)).toFixed(8)
    // console.log("pricecha", pricecha, sell1.Price, buy1.Price)
    //
    // // @ts-ignore
    // if (pricecha > 0.000001*5) {
    //
    //     const targetPrice = randomNum(Number(buy1.Price), Number(sell1.Price), 8)
    //     const targetAmount = randomNum(40, 3000, 0)
    //     const sorder = {
    //         amount: targetAmount,
    //         price: targetPrice,
    //     };
    //     const liquidTime = randomNum(1000, 50000, 4)
    //     console.log("liquidTime sleep:", liquidTime)
    //
    //     const buy = await trade.sellOrder(sorder);
    //     await sleep(liquidTime)
    //     const sell = await trade.buyOrder(sorder);
    //     if (Math.random() > 0.5) {
    //         const targetAmount = randomNum(40, 3000, 0)
    //         const sorder = {
    //             amount: targetAmount,
    //             price: sell1.Price-price_in,
    //         };
    //         const buy = await trade.sellOrder(sorder);
    //
    //     }  else{
    //         const targetAmount = randomNum(40, 3000, 0)
    //         const sorder = {
    //             amount: targetAmount,
    //             price: buy1.Price+price_in,
    //         };
    //         const buy = await trade.buyOrder(sorder);
    //
    //     }
    //     console.log("流动",sorder)
    // }else{
    //     if(ethCanBalance>15){
    //     //     const targetPrice =Number(sell1.Price)
    //     //     const targetAmount =  randomNum(40, 3000, 0)
    //     //     const sorder = {
    //     //         amount: targetAmount,
    //     //         price: targetPrice,
    //     //     };
    //     //     const buy = await trade.buyOrder(sorder);
    //     //     console.log("拉盘",sorder)
    //     //
    //     // }else{
    //         const targetPrice =Number(buy1.Price)
    //         const targetAmount =  randomNum(1000, 3000, 0)
    //         const sorder = {
    //             amount: targetAmount,
    //             price: targetPrice,
    //         };
    //         const buy = await trade.sellOrder(sorder);
    //         console.log("砸盘",sorder)
    //         cancelbot.start(10)
    //
    //
    //     }
    //
    //
    //
    // }


}
//买一卖一机器人
async function guadan(data) {
    //await cancelAll()
    const sell1 = data.Asks[0]
    const buy1 = data.Bids[0]
    const balance=await wedex.Wallet.getWalletBalances().toPromise()
    const ethCanBalance=getAmount(balance[0].totalAmount.minus(balance[0].frozenAmount))
    console.log(balance,ethCanBalance)
    if(data.Bids.length<20) {

        const targetPrice =Number(data.Bids[data.Bids.length-1].Price)
        const targetAmount =  randomNum(40, 3000, 0)
        const sorder = {
            amount: targetAmount,
            price: targetPrice-price_in,
        };
        const buy = await trade.buyOrder(sorder);
        console.log("la盘",sorder)
    }
    await sleep(2000)

    if(data.Asks.length<20) {

        const targetPrice =Number(data.Asks[data.Asks.length-1].Price)
        const targetAmount =  randomNum(40, 3000, 0)
        const sorder = {
            amount: targetAmount,
            price: targetPrice+price_in,
        };
        const buy = await trade.sellOrder(sorder);
        console.log("za盘",sorder)
    }
}
//买一卖一机器人
async function lapan(data) {
    //await cancelAll()
            const sell1 = data.Asks[3]

            const targetPrice =Number(sell1.Price)
            const targetAmount =  randomNum(40, 3000, 0)
            const sorder = {
                amount: targetAmount,
                price: targetPrice,
            };
            const buy = await trade.buyOrder(sorder);
            console.log("拉盘",sorder)



}//买一卖一机器人
async function zapan(data) {
    //await cancelAll()
            console.log(data)
            const sell1 = data.Bids[0]

            const targetPrice =Number(sell1.Price)
            const targetAmount =  randomNum(40, 3000, 0)
            const sorder = {
                amount: targetAmount,
                price: targetPrice,
            };
            const buy = await trade.sellOrder(sorder);
            console.log("砸盘",sorder)



}



async function main() {

    //  /cancelbot.start(100)
    // //
    setInterval(() => {
        wedex.Market.getOrderBook('LRC-ETH', 0, 0)

            .subscribe(
                async (data) => {
                    // await dingPrice(data)

                     await liquid(data);
                    //await liquid(data);
                    //await guadan(data);
                       //    await zapan(data);
                    // await watchPrice(data);
                }
            );
    }, 5000)
    // //
    // setInterval(() => {
    //     wedex.Market.getOrderBook('LRC-ETH', 0, 0)
    //
    //         .subscribe(
    //             async (data) => {
    //
    //             }
    //         );
    // }, 2000)

}

main()


//setInterval(main, 5000)



