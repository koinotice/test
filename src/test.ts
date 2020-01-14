require('dotenv').config(); // tslint:disable-line no-var-requires

const BigNumber = require('bignumber.js');
const rn = require('random-number');

import {WedexClient, HttpMethod, LogTypeValue} from 'wedex';
import {Account, ethereum, Utils as lightConeUtils} from '../src/dist';
import {getOrderId, lightconeGetAccount} from '../src/pkg/LightconeAPI';
import {CancelOrder} from './cancelAll';
import {LiquidOrder} from './liu';

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

const me = process.env;
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

// @ts-ignore
const wedex = new WedexClient({
	account: me,
	logType: LogTypeValue.None,

});
const liu = new LiquidOrder(me);

async function watch() {
	let data
	try {
		//
		data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();

		const guabuy = await liu.guabuydan(data);
		data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
		const guasell = await liu.guaselldan(data);
		data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
		const lakai = await liu.lakaijulv(data);
		data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
		const liudong = await liu.liudong(data);
		data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
		const reguq = await liu.regua();
		data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
		const cancel=await liu.cancelBuys();

	} catch (e) {
		console.log(e)
	} finally {
		watch();
	}

}

async function main() {
	const data = await wedex.Market.getOrderBook('LRC-ETH', 0, 0).toPromise();
	watch(data);
}

watch();
//liu.regua()

//setInterval(main, 5000)



