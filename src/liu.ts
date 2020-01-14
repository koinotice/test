const BigNumber = require('bignumber.js');
const rn = require('random-number');
import {WedexClient, HttpMethod, LogTypeValue} from 'wedex';
// import {Account, ethereum, Utils as lightConeUtils} from '../src/dist';
// import {getOrderId, lightconeGetAccount} from '../src/pkg/LightconeAPI';
// import {CancelOrder} from './cancelAll';
import {TradeOrder} from './trade';

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getAmount(amount) {
    return new BigNumber(amount).div(1e18).toString(10);

}

const price_in = 0.000001;
const Min = 110
const Max = 210
const options = {
    min: 10000
    , max: 100000
    , integer: true,
};

let I = 1

class LiquidOrder {
    public me;
    public page = 0;
    public wedex;
    public trade;
    public orders = [];
    public orderb = [];

    public constructor(me) {
        this.me = me;
        this.trade = new TradeOrder(me);

        this.wedex = new WedexClient({
            account: this.me,
            baseUrl: me.url,
            logType: LogTypeValue.None,
            logWriter: () => {
            }
        });
    }

    async init() {
        await this.trade.getOrderId()
    }

    async lakaijulv(data) {
        const sell1 = data.Asks[0];
        const buy1 = data.Bids[0];
        const balance = await this.wedex.Wallet.getWalletBalances().toPromise();

        const pricecha = (Number(sell1.Price) - Number(buy1.Price)).toFixed(8);

        const ethCanBalance = getAmount(balance[0].totalAmount.minus(balance[0].frozenAmount));
        console.log("pricecha", pricecha, price_in * 5, ethCanBalance)
        // @ts-ignore
        if (pricecha < price_in * 5) {
            console.log(1)
            if (ethCanBalance > 5) {
                console.log(2)

                const targetPrice = Number(sell1.Price);
                const targetAmount = getAmount(sell1.Size);
                const ethAmount = getAmount(sell1.Volume);

                if (ethAmount <= 1) {
                    const sorder = {
                        amount: targetAmount,
                        price: targetPrice,
                    };

                    // const buy = await this.trade.buyOrder(sorder);
                    // this.orderb.push(buy.orderHash);

                    console.log('lakaijulv buy:', sorder);

                } else {
                    const sorder = {
                        amount: targetAmount,
                        price: targetPrice,
                    };

                    // const buy = await this.trade.buyOrder(sorder);
                    // this.orderb.push(buy.orderHash);

                    console.log('lakaijulv buy:', sorder);
                }
                //else {
                // 	const targetPrice = Number(buy1.Price);
                // 	const targetAmount = getAmount(buy1.Size);
                //
                // 	const sorder = {
                // 		amount: targetAmount,
                // 		price: targetPrice,
                // 	};
                // 	try{
                // 		const buy = await this.trade.sellOrder(sorder);
                // 		console.log('lakaijulv sell:', sorder);
                // 		this.orders.push(buy.orderHash);
                //     }catch(e){
                //
                // 	}
                //
                //
                // }

            } else {
                // const targetPrice = Number(buy1.Price);
                // const targetAmount = getAmount(buy1.Size);
                //
                // const sorder = {
                // 	amount: targetAmount,
                // 	price: targetPrice,
                // };
                // try{
                // 	// const buy = await this.trade.sellOrder(sorder);
                // 	// this.orders.push(buy.orderHash);
                //
                // 	console.log('lakaijulv sell:', sorder);
                // }catch(e){
                //
                // }


            }
            try {
                data = await this.wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
                this.lakaijulv(data)
            } catch (e) {

            }

        }
    }

    async cancel(hash) {
        const res = await this.wedex.Trade.cancelOrder({
            // "accountId": 11,
            'orderHash': hash,
            'clientOrderId': hash
        }).toPromise();
        console.log(`cancel:`, res, hash);

    }

    async cancelBuys() {
        if (this.orderb.length > 8) {
            const orders = this.orderb.splice(this.orderb.length - 5);
            for (const [index, order] of orders.entries()) {

                await this.cancel(order);

            }
        }
        //
        if (this.orders.length > 8) {
            const orders1 = this.orders.splice(this.orders.length - 5);
            for (const [index, order] of orders1.entries()) {

                await this.cancel(order);

            }
        }

    }

	async buyAndSell(data) {
		const sell1 = data.Asks[0];
		const buy1 = data.Bids[0];

		const targetPrice = randomNum(Number(buy1.Price), Number(sell1.Price), 8);
		const targetAmount = randomNum(Min, Max, 6);
		const sorder = {
			market: "LRC-ETH",
			amount: targetAmount,
			price: targetPrice,
		};


		// const liquidTime = randomNum(100, 1000, 4)
		// console.log("liquidTime sleep:", liquidTime)
		try {
			sorder.price=sell1.Price
			const sell = await this.trade.sellOrder(sorder);
			//this.orderb.push(buy.orderHash);

			 console.log('liudong sell', sell,sorder);
			// // await sleep(2000)
			sorder.price=buy1.Price
			const buy = await this.trade.buyOrder(sorder);
			console.log('liudong buy', buy,sorder);
			//this.orders.push(sell.orderHash);
		} catch (e) {
			console.log('liudong error', e);
		}

		// await this.cancelBuys()
		//
		// await sleep(2000);
		// for (const [index, order] of this.orders.entries()) {
		//
		// 	if (order.status == 'processing') {
		// 		this.cancel(order);
		// 	}
		//
		// }
		//
		// for (const [index, order] of this.orderb.entries()) {
		//
		// 	if (order.status == 'processing') {
		// 		this.cancel(order);
		//
		// 	}
		//
		// }
	}

    async liudong(data) {
        const sell1 = data.Asks[0];
        const buy1 = data.Bids[0];



        const targetPrice = randomNum(Number(buy1.Price), Number(sell1.Price), 8);
        // @ts-ignore
		const targetAmount = parseFloat(randomNum(Min, Max, 0))+0.123456;
        const sorder = {
            market: "LRC-ETH",
            amount: targetAmount,
            price: targetPrice,
        };


        // const liquidTime = randomNum(100, 1000, 4)
        // console.log("liquidTime sleep:", liquidTime)
        try {
			// this.trade.sellOrder(sorder)
			// this.trade.buyOrder(sorder)
            const buy = await this.trade.sellOrder(sorder);
            //this.orderb.push(buy.orderHash);
           console.log('liudong sell', buy);
            // // await sleep(2000)
           const sell = await this.trade.buyOrder(sorder);
           console.log('liudong buy', sell);
            //this.orders.push(sell.orderHash);
        } catch (e) {
            console.log('liudong error', e);
        }

        // await this.cancelBuys()
        //
        // await sleep(2000);
        // for (const [index, order] of this.orders.entries()) {
        //
        // 	if (order.status == 'processing') {
        // 		this.cancel(order);
        // 	}
        //
        // }
        //
        // for (const [index, order] of this.orderb.entries()) {
        //
        // 	if (order.status == 'processing') {
        // 		this.cancel(order);
        //
        // 	}
        //
        // }
    }

    async liudongUSDT(data) {
        const sell1 = data.Asks[0];
        const buy1 = data.Bids[0];


        // const balance = await this.wedex.Wallet.getWalletBalances().toPromise();
        //
        // const pricecha = (Number(sell1.Price) - Number(buy1.Price)).toFixed(8);
        //
        // const ethCanBalance = getAmount(balance[0].totalAmount.minus(balance[0].frozenAmount));
        // console.log("pricecha", pricecha)
        // console.log("ethCanBalance", ethCanBalance)


        const targetPrice = randomNum(Number(buy1.Price), Number(sell1.Price), 6);
        // @ts-ignore
		const targetAmount = parseFloat(randomNum(Min, Max, 0));
        const sorder = {
            market: "LRC-USDT",
            amount: targetAmount,
            price: targetPrice,
        };

        //console.log(sorder)
        // const liquidTime = randomNum(100, 1000, 4)
        // console.log("liquidTime sleep:", liquidTime)
        try {
			// this.trade.sellOrder(sorder)
			// this.trade.buyOrder(sorder)
            const buy = await this.trade.sellOrder(sorder);
            //this.orderb.push(buy.orderHash);
           console.log('liudong sell', buy);
            // // await sleep(2000)
           const sell = await this.trade.buyOrder(sorder);
           console.log('liudong buy', sell);
            //this.orders.push(sell.orderHash);
        } catch (e) {
            console.log('liudong error', e);
        }

        // await this.cancelBuys()
        //
        // await sleep(2000);
        // for (const [index, order] of this.orders.entries()) {
        //
        // 	if (order.status == 'processing') {
        // 		this.cancel(order);
        // 	}
        //
        // }
        //
        // for (const [index, order] of this.orderb.entries()) {
        //
        // 	if (order.status == 'processing') {
        // 		this.cancel(order);
        //
        // 	}
        //
        // }
    }

    async regua() {

        let sub = this.wedex.Request.custom(
            HttpMethod.GET,
            'http://13.112.139.43:31610/api/v1/trade',
            {
                'market': 'LRC-ETH',
                'fromId': 0,
                'limit': 0,
            },
            false
        );

        let api = await sub.toPromise();
        let od = api.trades[0];

        let timeprice = Number(od.price);

        // 0.00015
        // 0.000002
        const s1 = randomNum(1, 5, 0);

        const targetPrice1 = Number(timeprice + (price_in) / 2).toFixed(8);
        const targetAmount = parseInt(randomNum(Min, Max, 0));


        const sorder = {
            amount: targetAmount,
            price: (targetPrice1)
        };

        const sell = await this.trade.sellOrder(sorder);
        console.log('regua sell', sorder, sell);
        this.orders.push(sell.orderHash);

        await sleep(1000);
        const s = randomNum(1, 5, 0);
        const targetPrice = Number(timeprice - price_in / 2).toFixed(8);
        const targetAmount1 = randomNum(Min, Max, 0);
        const border = {
            amount: targetAmount1,
            price: (targetPrice),
        };
        console.log('targetb', border);
        const buy = await this.trade.buyOrder(border);
        console.log('regua  buy', border);

        this.orderb.push(buy.orderHash);

    }

    //挂单
    async guabuydan(data) {


        const sell1 = data.Asks[0];
        const buy1 = data.Bids[0];
        const balance = await this.wedex.Wallet.getWalletBalances().toPromise();
        const ethCanBalance = getAmount(balance[0].totalAmount.minus(balance[0].frozenAmount));

        if (data.Bids.length < 20) {

            const targetPrice = Number(data.Bids[data.Bids.length - 1].Price).toFixed(8);

            const targetAmount = randomNum(Min, Max, 0);
            // @ts-ignore
            const sorder = {
                amount: targetAmount,
                price: (targetPrice - price_in).toFixed(8),
            };

            try {
                const buy = await this.trade.buyOrder(sorder);
                this.orderb.push(buy.orderHash);

                console.log('guabuydan buy', sorder);
            } catch (e) {
                console.log(e)
            }

        }
        return true;

    }//挂单
    async guaselldan(data) {
        //await cancelAll()
        const sell1 = data.Asks[0];
        const buy1 = data.Bids[0];
        const balance = await this.wedex.Wallet.getWalletBalances().toPromise();
        const ethCanBalance = getAmount(balance[0].totalAmount.minus(balance[0].frozenAmount));

        if (data.Asks.length < 20) {

            const targetPrice = Number(data.Asks[0].Price);
            const targetAmount = randomNum(Min, Max, 0);
            I = I + 1
            const sorder = {
                amount: targetAmount,
                price: (targetPrice + price_in * (I)).toFixed(8),
            };
            console.log(sorder)
            try {
                const buy = await this.trade.sellOrder(sorder);
                console.log('guabuydan sell', sorder);
                this.orders.push(buy.orderHash);
            } catch (e) {
                console.log(e)
            }


        }
        return true;
    }
}

export {
    LiquidOrder
};




