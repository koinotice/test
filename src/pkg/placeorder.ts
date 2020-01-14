
const BigNumber = require('bignumber.js');

import { Account, ethereum,Utils as lightConeUtils} from '../Ligjhtcone';
import {
  sendDeposit,
  lightconeGetAccountUntilSuccess,
  lightconeGetAccount,
  getApiKey,
  getNonce,
  getOrderId,
  submitOrderToLightcone,
} from './LightconeAPI';

import utils from "../utils"


let pkAccount, dexAccount,dexNonce,address;

let password=process.env.PASSWORD
const passwordHash = lightConeUtils.keccakHash(password);
console.log("passwordHash",passwordHash)

function dec(balance) {
  return new BigNumber(10).pow(Number(8)).times(balance).toString(10)
}
export async function buyOrder(order){
  pkAccount = ethereum.account.fromPrivateKey(
    order.private,
  );
  let account = new Account(pkAccount);
  const relayAccount = await lightconeGetAccount(pkAccount.getAddress());


  const validSince = new Date().getTime() / 1000;
  const validUntil = new Date().getTime() / 1000 + 3600 * 24 * 30;


  let keyPair = account.generateKeyPair(passwordHash);

  console.log(relayAccount,keyPair)


  const apiKey=await utils.getApiKey1(pkAccount,relayAccount.accountId,passwordHash)
  console.log(apiKey)

  let orderId=await getOrderId(relayAccount.accountId,0,apiKey)

  console.log('clientOrderId',orderId)



  console.log(dec(123))

  const amountInBigNumber = new BigNumber(order.amount);

  console.log(amountInBigNumber)
  let price=order.price

  //let amountB = 123

 let  amountS = amountInBigNumber.times(price).toFixed();

  let amountB = amountInBigNumber.toFixed();

  console.log("acmounts",amountS)
  let signedOrder = account.submitOrder(
    pkAccount.getAddress(),
    relayAccount.accountId,
    keyPair.publicKeyX,
    keyPair.publicKeyY,
    keyPair.secretKey,
    "ETH",
    "LRC",
    amountS,
    amountB,
    orderId,
    validSince,
    validUntil,

  );
  console.log(signedOrder)


  // let ok=await request({
  //   apiKey:apiKey,
  //   method:"POST",
  //   data:signedOrder,
  // });
  // console.log(ok)
    const response = await submitOrderToLightcone(signedOrder,apiKey);

   console.log(response)


}


export async function sellOrder(order){
  pkAccount = ethereum.account.fromPrivateKey(
    order.private,
  );
  let account = new Account(pkAccount);
  const relayAccount = await lightconeGetAccount(pkAccount.getAddress());


  const validSince = new Date().getTime() / 1000;
  const validUntil = new Date().getTime() / 1000 + 3600 * 24 * 30;


  let keyPair = account.generateKeyPair(passwordHash);

  console.log(relayAccount,keyPair)


  const apiKey=await utils.getApiKey1(pkAccount,relayAccount.accountId,passwordHash)
  console.log(apiKey)

  let orderId=await getOrderId(relayAccount.accountId,2,apiKey)


  console.log('clientOrderId',orderId)



  console.log(dec(123))

  const amountInBigNumber = new BigNumber(order.amount);

  console.log(amountInBigNumber)
  let price=order.price

  //let amountB = 123

 let  amountB = amountInBigNumber.times(price).toFixed();

  let amountS = amountInBigNumber.toFixed();

  console.log("acmounts",amountS)
  let signedOrder = account.submitOrder(
    pkAccount.getAddress(),
    relayAccount.accountId,
    keyPair.publicKeyX,
    keyPair.publicKeyY,
    keyPair.secretKey,
    "LRC",
    "ETH",

    amountS,
    amountB,
    orderId,
    validSince,
    validUntil,

  );
  console.log(signedOrder)


  // let ok=await request({
  //   apiKey:apiKey,
  //   method:"POST",
  //   data:signedOrder,
  // });
  // console.log(ok)
    const response = await submitOrderToLightcone(signedOrder,apiKey);

   console.log(response)


}

