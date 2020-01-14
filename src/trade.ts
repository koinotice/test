require('dotenv').config(); // tslint:disable-line no-var-requires

const BigNumber = require('bignumber.js');
const rn = require('random-number');

import {WedexClient, HttpMethod, LogTypeValue} from 'wedex';


import {Account,WalletAccount, ethereum, Utils as lightConeUtils} from "./lightcone_test";


import {getOrderId, lightconeGetAccount} from "../src/pkg/LightconeAPI";


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

//const me = process.env


class TradeOrder {
    public me
    public page = 0
    public wedex
    public orders = []
    public orderBuyId=0
    public orderSellId=0
    public orderBuyUsdtId=0
    public constructor(me) {
        this.me = me;
         this.wedex = new WedexClient({
            account: this.me,
            logType: LogTypeValue.None,
            baseUrl: me.url,
            logWriter: () => {
            }
        });


    }

    async getId(accountId,tokenSId){
        const data = {
            accountId: accountId,
            tokenSId: tokenSId,
        }
         let sub = this.wedex.Request.custom(
            HttpMethod.POST,
            `${this.me.url}v1/orderId`,
            data,
            true
        )
        let api = await sub.toPromise()
        console.log(api)
        return api.orderId
    }

    async getOrderId(){
        this.orderBuyId=(await this.getId(this.me.accountId, 0))
        this.orderBuyUsdtId=(await this.getId(this.me.accountId, 3))
        this.orderSellId=await this.getId(this.me.accountId, 2)
        this.orderSellUSDTId=await this.getId(this.me.accountId, 3)

        console.log(this.orderBuyId,this.orderSellId,this.orderSellUSDTId)
    }

    async cancel(hash) {
        const res = await this.wedex.Trade.cancelOrder({
            // "accountId": 11,
            'orderHash': hash,
            'clientOrderId': hash
        }).toPromise();
        console.log(`cancel:`, res, hash);

    }

    async buyOrder(order) {

        // let pkAccount = ethereum.account.fromPrivateKey(
        //     this.me.private,
        // );
        let pkAccount=new WalletAccount()

        let account = new Account(pkAccount);

        // let password = this.me.password
        // const passwordHash = lightConeUtils.keccakHash(password);
        //
        // let sub = this.wedex.Request.custom(
        //     HttpMethod.GET,
        //     `${this.me.url}v1/account`,
        //     {address: this.me.address},
        //     false
        // )
        //
        //
        // //console.log(sub)
        //
        //
        // let api = await sub.toPromise()
        // let relayAccount = api.account


        const validSince = new Date().getTime() / 1000;
        const validUntil = new Date().getTime() / 1000 + 3600 * 24 * 30;


        let keyPair = {
            publicKeyX: this.me.publicKeyX,
            publicKeyY: this.me.publicKeyY,
            secretKey: this.me.secret,
        }
        //account.generateKeyPair(password);



        //await utils.getApiKey1(pkAccount,relayAccount.accountId,passwordHash)

      //  let orderId =this.orderBuyId++
       // await getOrderId(this.me.accountId, 0, apiKey)


        const amountInBigNumber = new BigNumber(order.amount);

        let price = order.price
        const tokens=order.market.split("-")

        //let amountB = 123
        let orderId
        let amountS

        let amountB = amountInBigNumber.toFixed();
        if(tokens[1]=="ETH"){
            orderId=this.orderBuyId++
            console.log("eth",orderId)
            amountS = amountInBigNumber.times(price).toFixed();
        }
        if(tokens[1]=="USDT"){
            orderId=this.orderBuyUsdtId++
            amountS = amountInBigNumber.times(price).toFixed(2);
        }


        let signedOrder = account.submitOrder(
            this.me.address,
            this.me.accountId,
            keyPair.publicKeyX,
            keyPair.publicKeyY,
            keyPair.secretKey,
            tokens[1],

            tokens[0],

            amountS,
            amountB,
            orderId,
            validSince,
            validUntil,
        );


        return this.wedex.Trade.placeOrder(signedOrder).toPromise()
    }


    async sellOrder(order) {

        // let pkAccount = ethereum.account.fromPrivateKey(
        //     this.me.private
        // );
        let pkAccount=new WalletAccount()
        let account = new Account(pkAccount);

        //let password = this.me.password
        // const passwordHash = lightConeUtils.keccakHash(password);
        //  let sub = this.wedex.Request.custom(
        //     HttpMethod.GET,
        //     `${this.me.url}v1/account`,
        //     {address: this.me.address},
        //     false
        // )
        //
        //
        // let api = await sub.toPromise()
        // let relayAccount = api.account


        const validSince = new Date().getTime() / 1000-60*60*24;
        const validUntil = new Date().getTime() / 1000 + 3600 * 24 * 30;


        //let keyPair = account.generateKeyPair(passwordHash);
        let keyPair = {
            publicKeyX: this.me.publicKeyX,
            publicKeyY: this.me.publicKeyY,
            secretKey: this.me.secret,
        }

        //const apiKey = this.me.apiKey
        //await utils.getApiKey1(pkAccount,relayAccount.accountId,passwordHash)
        const tokens=order.market.split("-")





        const amountInBigNumber = new BigNumber(order.amount);


        let price = order.price

        //let amountB = 123

        let amountB

        let amountS = amountInBigNumber.toFixed();
        let orderId= this.orderSellId++
        if(tokens[1]=="ETH"){

            amountB = amountInBigNumber.times(price).toFixed();
        }
        if(tokens[1]=="USDT"){

            amountB = amountInBigNumber.times(price).toFixed(2);
        }

        let signedOrder = account.submitOrder(
            this.me.address,
            this.me.accountId,
            keyPair.publicKeyX,
            keyPair.publicKeyY,
            keyPair.secretKey,
            tokens[0],
            tokens[1],

            amountS,
            amountB,
            orderId,
            validSince,
            validUntil,
        );
        return this.wedex.Trade.placeOrder(signedOrder).toPromise()

    }
}

export {
    TradeOrder
}
