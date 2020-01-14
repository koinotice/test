require('dotenv').config(); // tslint:disable-line no-var-requires

import {
    WedexClient,
    LogTypeValue,
    LedgerTypeValue,
    WithdrawalStatusValue,
    TimeframeValue,
    OrderSideValue,
    OrderStateValue,
    Model,
    HttpMethod
} from 'wedex';
import * as Rx from 'rxjs';

const axios = require("axios")


let page = 20


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class CancelOrder {
    public me
    public page = 0

    public constructor(account) {
        this.me = account;
    }

    public endPage = 10
    public wedex

    async start(ep) {

        this.wedex = new WedexClient({
            account: this.me,
            logType: LogTypeValue.Error,
            logWriter: console.log,
            baseUrl:this.me.url
        });
        this.endPage = ep
        console.log("cancel start ^&")
        await this.getAllOrder()

    }

    async getAllOrder() {

        try {

            // const instance = axios.create({
            // 	baseURL: 'http://13.112.139.43:31610/api/v1',
            // 	timeout: 10000,
            // 	headers: {'X-API-KEY': this.me.apiKey}
            // });
            // const url=`/orders?accountId=${this.me.accountId}&market=LRC-ETH&statuses=['processing']&start=0&end=0&limit=50&side=sell&offset=${50*this.page}`
            // console.log(url)
            //const data=await instance.get(url)
            const orders = await this.wedex.Trade.getAllOrder({
                "accountId": this.me.accountId,
                "market": "LRC-ETH",
                "statuses": ['processing'],
                "start": 0,
                "end": 0,
                "fromHash": "",
                "limit": 100,
                "side": "sell",
                "offset": this.page * 50
            }).toPromise()
            console.log(orders)
            //const orders=(data.data.orders)

            if (orders.length > 0) {
                for (const [index, order] of orders.entries()) {
                     console.log(order)
                    // if (order.status == "processing") {
                    const res = await this.wedex.Trade.cancelOrder({
                        // "accountId": 11,
                        "orderHash": order.hash,
                        "clientOrderId": order.hash
                    }).toPromise()
                    console.log(`Received Todo :`, res);

                }

            }

            // const orders = await wedex.Trade.getAllOrder({
            //     "accountId": this.me.accountId,
            //     "market": "LRC-ETH",
            //     "statuses": "processing",
            //     "start": 0,
            //     "end": 0,
            //     //"fromHash": "2600105125336468966417510367500403435128941502452005674156103328855968837178",
            //     "limit": 50,
            //     "offset": this.page * 50
            // }).toPromise()
            // if (orders.length > 0) {
            //     for (const [index, order] of orders.entries()) {
            //         console.log(order.Status)
            //         if (order.Status == "processing") {
            //             const res = await wedex.Trade.cancelOrder({
            //                 // "accountId": 11,
            //                 "orderHash": order.Hash,
            //                 "clientOrderId": order.Hash
            //             }).toPromise()
            //             console.log(`Received Todo :`, res);
            //
            //         }
            //
            //     }
            // }
            // @ts-ignore
            this.page++
            if (page < this.endPage) {
                // await this.getAllOrder()
            }
            console.log('Finished!', this.page);
        } catch (e) {
            //this.page = 0
            console.log(e)

            //await this.getAllOrder()
        }
    }
}


export {
    CancelOrder
}


