import axios from 'axios';

// export const SERVER_URL = 'http://localhost:9000';
//export const SERVER_URL = 'http://a6d9a75271a6511eaa1b006464d4ce7c-1076987781.ap-east-1.elb.amazonaws.com';
export const SERVER_URL = process.env.purl;

// export const SERVER_URL = 'http://52.82.57.13:31610';

export function getProxyURL() {
  // let proxyURL = '/lightcone_v3/';
  // if (
  //   window.location.hostname === 'localhost' ||
  //   window.location.hostname === '127.0.0.1'
  // ) {
  //   proxyURL = 'http://52.196.115.12:8080/lightcone_v3/';
  //   //  proxyURL = 'http://localhost:8080/lightcone_v3/';
  // }
  // return proxyURL;
  // TODO: 部署时需要注意
  return 'http://52.196.115.12:8080/lightcone_v3/';
}

export function getRefreshDurationInMillionSeconds() {
  // FIXME: this doesn't work
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    // Every minute
    return 20 * 1000;
  } else {
    return 1 * 1000;
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sendApprove(signedEthereumTx) {
  return sendDeposit(signedEthereumTx);
}

export async function sendDeposit(signedEthereumTx) {
  const data = {
    data: signedEthereumTx,
  };
  try {
    const response = await axios.post(getProxyURL(), {
      method: 'POST',
      baseURL: SERVER_URL,
      url: '/api/v1/deposit',
      data,
    });
    return parseResponse(response);
  } catch (e) {
    throw e;
  }
}

export function _parseResponse(response) {
  const data = response['data'];
  const resultInfo = data['resultInfo'];
  const errorData = data['error'];

  // Some API endpoints in the old versions don't have resultInfo.
  if (resultInfo) {
    const code = resultInfo['code'];
    if (code !== 0) {
      const errorMessage = resultInfo['message'];
      throw Error(errorMessage);
    }
    return data;
  } else if (errorData) {
    const code = errorData['code'];
    if (code !== 0) {
      const errorMessage = `${errorData['code']} ${errorData['message']}`;
      throw Error(errorMessage);
    }
    return data;
  } else {
    return data;
  }
}

export function parseResponse(response) {
  try {
    return _parseResponse(response);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err);
  }
}

export async function 	getApiKey(data, signed) {
  try {
    const signature = signed.Rx + ',' + signed.Ry + ',' + signed.s;
    const headers = {
      'X-API-SIG': signature,
    };
    const response = await axios.post(
      getProxyURL(),
      {
        method: 'GET',
        baseURL: SERVER_URL,
        url: '/api/v1/apiKey',
        data,
      },
      { headers: headers },
    );
    return parseResponse(response);
  } catch (e) {
    throw e;
  }
}

export async function getDeposits(
  accountId,
  statuses,
  types,
  start,
  end,
  fromHash,
  limit,
  apiKey,
) {
  const data = {
    accountId: accountId,
    statuses: statuses,
    types: types,
    start: start,
    end: end,
    fromHash: fromHash,
    limit: limit,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  try {
    const response = await axios.post(
      getProxyURL(),
      {
        method: 'GET',
        baseURL: SERVER_URL,
        url: '/api/v1/user/deposits',
        data,
      },
      { headers: headers },
    );
    return parseResponse(response);
  } catch (error) {
    throw error;
  }
}

export async function getWithdraws(
  accountId,
  statuses,
  types,
  start,
  end,
  fromHash,
  limit,
  apiKey,
) {
  const data = {
    accountId: accountId,
    statuses: statuses,
    types: types,
    start: start,
    end: end,
    fromHash: fromHash,
    limit: limit,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  try {
    const response = await axios.post(
      getProxyURL(),
      {
        method: 'GET',
        baseURL: SERVER_URL,
        url: '/api/v1/user/onchainWithdrawal',
        data,
      },
      { headers: headers },
    );
    return parseResponse(response);
  } catch (error) {
    throw error;
  }
}

export async function getNonce(address) {
  const data = {
    address,
  };
  try {
    const response = await axios.post(getProxyURL(), {
      method: 'GET',
      baseURL: SERVER_URL,
      url: '/api/v1/ethNonce',
      data,
    });
    if (response['data']['nonce'] !== undefined) {
      return response['data']['nonce'];
    } else {
      throw new Error('Failed to get nonce');
    }
  } catch (e) {
    throw e;
  }
}

export async function getDexNonce(data) {
  try {
    const response = await axios.post(getProxyURL(), {
      method: 'POST',
      baseURL: SERVER_URL,
      url: '/api/v1/dexNonce',
      data,
    });
    return parseResponse(response);
  } catch (e) {
    throw e;
  }
}

export async function submitOffchainWithdrawal(data, apiKey) {
  try {
    const headers = {
      'X-API-KEY': apiKey,
    };
    const response = await axios.post(
      getProxyURL(),
      {
        method: 'POST',
        baseURL: SERVER_URL,
        url: '/api/v1/offchainWithdrawal',
        data,
      },
      { headers: headers },
    );
    return parseResponse(response);
  } catch (e) {
    throw e;
  }
}

export async function submitOrderToLightcone(data, apiKey) {
  try {
    const headers = {
      'X-API-KEY': apiKey,
    };

    console.log(headers,getProxyURL(),SERVER_URL,data)
    const response = await axios.post(
      getProxyURL(),
      {
        method: 'POST',
        baseURL: SERVER_URL,
        url: '/api/v1/order',
        data,
      },
      { headers: headers },
    );

    // console.log(response)
    return parseResponse(response);
  } catch (e) {
    throw e;
  }
}

// Return order id
export async function getOrderId(accountId, tokenSId, apiKey) {
  const data = {
    accountId: accountId,
    tokenSId: tokenSId,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  try {
    const response = await axios.post(
      getProxyURL(),
      {
        method: 'GET',
        baseURL: SERVER_URL,
        url: '/api/v1/orderId',
        data,
      },
      { headers: headers },
    );

    const responseData = response['data'];
    if (responseData['error'] === undefined) {
      return response['data']['orderId'];
    } else {
      throw new Error(responseData['error']['message']);
    }
  } catch (e) {
    throw e;
  }
}

// Wait for 20 seconds
export async function lightconeGetAccountUntilSuccess(address) {
  const data = {
    address,
  };
  try {
    var i = 0;
    // Wait for 20 seconds
    while (i < 5) {
      const response = await axios.post(getProxyURL(), {
        method: 'GET',
        baseURL: SERVER_URL,
        url: '/api/v1/account',
        data,
      });
      const responseData = response['data'];
      if (responseData['error'] === undefined) {
        return responseData;
      } else {
        // account is not ready yet. sleep 1 seconds.
        // throw new Error(responseData['error']['message']);
        await sleep(1000);
        i = i + 1;
      }
    }
    return {};
  } catch (e) {
    throw e;
  }
}

export async function lightconeGetAccount(address) {
  const data = {
    address,
  };
  try {
    const response = await axios.post(getProxyURL(), {
      method: 'GET',
      baseURL: SERVER_URL,
      url: '/api/v1/account',
      data,
    });
    const responseData = response['data'];
    if (responseData['error'] === undefined) {
      return responseData.account;
    } else if (responseData['error'].code === 101002) {
      return null;
    } else {
      throw new Error(responseData['error']['message']);
    }
  } catch (e) {
    if (e.response.status === 404) {
      return null;
    }
    throw new Error(e);
  }
}

export async function getTimestamp() {
  try {
    const response = await axios.post(getProxyURL(), {
      method: 'GET',
      baseURL: SERVER_URL,
      url: '/api/v1/timestamp',
    });

    const responseData = response['data'];
    if (responseData['error'] === undefined) {
      return responseData;
    } else {
      throw new Error(responseData['error']['message']);
    }
  } catch (error) {
    throw error;
  }
}

export async function getCandlestick(market, interval) {
  const data = {
    market,
    interval,
  };
  try {
    const response = await axios.post(getProxyURL(), {
      method: 'GET',
      baseURL: SERVER_URL,
      url: '/api/v1/candlestick',
      data,
    });
    const responseData = response['data'];
    if (responseData['error'] === undefined) {
      return responseData['candles'];
    } else {
      throw new Error(responseData['error']['message']);
    }
  } catch (error) {
    throw error;
  }
}

export async function getTrade(market, limit) {
  const data = {
    market,
    limit,
  };
  try {
    const response = await axios.post(getProxyURL(), {
      method: 'GET',
      baseURL: SERVER_URL,
      url: '/api/v1/trade',
      data,
    });
    const responseData = response['data'];
    if (responseData['error'] === undefined) {
      return responseData['trades'];
    } else {
      throw new Error(responseData['error']['message']);
    }
  } catch (error) {
    throw error;
  }
}

// TODO: verify filter
export async function getTransactions(accountId, limit, apiKey) {
  const data = {
    accountId,
    limit,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  try {
    const response = await axios.post(
      getProxyURL(),
      {
        method: 'GET',
        baseURL: SERVER_URL,
        url: '/api/v1/user/transfers',
        data,
      },
      { headers: headers },
    );

    const responseData = response['data'];
    if (responseData['error'] === undefined) {
      return responseData['transactions'];
    } else {
      throw new Error(responseData['error']['message']);
    }
  } catch (error) {
    throw error;
  }
}

export async function getDepositHistory(accountId, limit, apiKey) {
  const data = {
    accountId,
    types: 'DEPOSIT',
    limit,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  try {
    const response = await axios.post(
      getProxyURL(),
      {
        method: 'GET',
        baseURL: SERVER_URL,
        url: '/api/v1/user/deposits',
        data,
      },
      { headers: headers },
    );

    const responseData = response['data'];
    if (responseData['error'] === undefined) {
      return responseData['transactions'];
    } else {
      throw new Error(responseData['error']['message']);
    }
  } catch (error) {
    throw error;
  }
}

export async function getWithdrawalHistory(accountId, limit, apiKey) {
  const data = {
    accountId,
    types: 'DEPOSIT',
    limit,
  };
  const headers = {
    'X-API-KEY': apiKey,
  };
  try {
    const response = await axios.post(
      getProxyURL(),
      {
        method: 'GET',
        baseURL: SERVER_URL,
        url: '/api/v1/user/withdrawals',
        data,
      },
      { headers: headers },
    );

    const responseData = response['data'];
    if (responseData['error'] === undefined) {
      return responseData['transactions'];
    } else {
      throw new Error(responseData['error']['message']);
    }
  } catch (error) {
    throw error;
  }
}
