import { Account, ethereum,Utils as lightConeUtils} from '@mappy/lightcone';
import {
  sendDeposit,
  lightconeGetAccountUntilSuccess,
  lightconeGetAccount,
  getApiKey,
  getNonce,
  getOrderId,
  submitOrderToLightcone,
} from '../LightconeAPI';

import utils from "../utils"
export async function changePassWord (password) {
    let pkAccount, dexAccount,dexNonce,address;
    pkAccount = ethereum.account.fromPrivateKey(
      process.env.PRIVATE,
    );
    console.log(password)
 
    const passwordHash = lightConeUtils.keccakHash(password);

    address=  pkAccount.getAddress().toLowerCase()
    dexAccount = new Account(pkAccount);
    //  dexAccount=new Account("0x0B57fDa2A1fa7eAf691Fbd21929c1022F27b6569")
    // console.log(dexAccount);
    //
    // console.log(address);
  
    // let keyPair1 = dexAccount.generateKeyPair(passwordHash);
  
    // console.log("keyPair1,",keyPair1)
  
    dexNonce=await getNonce(address)
  
    console.log(dexNonce)
   
   
    let createOrUpdateAccountResponse = await dexAccount.createOrUpdateAccount(passwordHash, dexNonce, 100, '');
  
    console.log(createOrUpdateAccountResponse)
    const signedEthereumTx = createOrUpdateAccountResponse['signedTx'];
    // const keyPair = createOrUpdateAccountResponse['keyPair'];
  
    // if (keyPair.secretKey === undefined) {
    //   throw new Error(
    //     'Failed to parse the response of account creation.'
    //   );
    // }
  
  
    // console.log(passwordHash)
    const relayAccount = await lightconeGetAccount(address);
    console.log("relayAccount",relayAccount)
    // let valid =  utils.checkPassword(pkAccount,passwordHash, relayAccount)
  
    // console.log(valid)
    ///const keyPairCipherText = encrypt(keyPair.secretKey, passwordHash);
  
    console.log('signedEthereumTx: ', signedEthereumTx);
    const response = await sendDeposit(signedEthereumTx);
  
    console.log(response)
    //const data = response['result'];
  
    //console.log(rawTx);
  };
  