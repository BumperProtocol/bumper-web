import Config from '../../config';
import ctx from '../index';

const { WBNB2BUMPER } = Config.PRICE_ADDRESS;
const PRICE_ADDRESS = Config.PRICE_ADDRESS;
const LP_ADDRESS = Config.LP_ADDRESS;

export const getColPrice = async (col, colIndex = 0) => {
  const { LpContract } = ctx.data;
  const instance = await LpContract.at(PRICE_ADDRESS[col]);
  let res = await instance.getReserves() // get the amount of tokens
  let price = 0;
  if (colIndex === 0) { // the index of col. the price of col is paired amount / col amount
    price = Math.round(res._reserve1 * 100 / res._reserve0) / 100
  } else {
    price = Math.round(res._reserve0 * 100 / res._reserve1) / 100
  }
  let map = ctx.data.colPriceMap || {}
  map[col] = price
  ctx.data.colPriceMap = map
  console.log('colPrice', col, price)
  return
}

export const getBcTokenPrice = async (col) => {
  if(!LP_ADDRESS[col]){
    return
  }
  const { LpContract } = ctx.data;
  const instance = await LpContract.at(LP_ADDRESS[col]);
  let res = await instance.getReserves()
  // token0： bctoken
  // token1： wbnb
  // num0 * price0 = num1 * price1
  // bcPrice = price0 / price1 = num1 / num0
  let price = Math.round(res._reserve1 * 100000 / res._reserve0) / 100000
  let map = ctx.data.bcPriceMap || {}
  map[col] = price
  ctx.data.bcPriceMap = map
  console.log('bcPrice', col, price)
  return
}