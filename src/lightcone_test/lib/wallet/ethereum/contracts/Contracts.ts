import Contract from "./Contract";

// @ts-ignore
import erc20Abi from "../../config/abis/erc20";

// @ts-ignore
import wethAbi from "../../config/abis/weth.json";
// @ts-ignore
import airdropAbi from "../../config/abis/airdrop.json";
// @ts-ignore
import exchangeAbi from "../../config/abis/exchange.json";

const WETH = new Contract(wethAbi);
const ERC20Token = new Contract(erc20Abi);
const AirdropContract = new Contract(airdropAbi);
const ExchangeContract = new Contract(exchangeAbi);

export default {
  ERC20Token,
  WETH,
  AirdropContract,
  ExchangeContract
};
