import _ from 'lodash'
import { Account, Utils } from '../../Ligjhtcone'

import { getApiKey } from '../LightconeAPI';
export async function getApiKey1 (pkAccount,accountId, passwordHash) {
  let exchangeAccount = new Account(pkAccount);
  const keyPair = exchangeAccount.generateKeyPair(passwordHash);
  let { publicKeyX, publicKeyY, secretKey } = keyPair

  const signed = exchangeAccount.getApiKey(
    accountId,
    publicKeyX,
    publicKeyY,
    secretKey
  );
  const data = {
    accountId: accountId,
    publicKeyX: publicKeyX,
    publicKeyY: publicKeyY
  };
  // 服务端生成
  let resp = await getApiKey(data, signed.signature);
  return resp.account
}

export function checkPassword (pkAccount,passwordHash, relayAccount) {
  let exchangeAccount = new Account( pkAccount);
  const keyPair = exchangeAccount.generateKeyPair(passwordHash);
 // let keyPair = dexAccount.generateKeyPair(password);

  console.log("keyPair",keyPair)
  return (
    keyPair.secretKey &&
    keyPair.publicKeyX === relayAccount.publicKeyX &&
    keyPair.publicKeyY === relayAccount.publicKeyY
  )
}

export default {
  checkPassword,
  getApiKey1,

}
