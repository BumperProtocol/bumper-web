import Config from '../../config';
import ctx from '../index';
import { convertByWei } from '../../utils';

// col
const LP_ADDRESS = Config.LP_ADDRESS

// my amount in lp contract. function balanceOf
export const getLpBalance = async (col, address) => {
  if(!LP_ADDRESS[col]){
    return
  }
  const { Erc20Contract } = ctx.data;
  const instance = await Erc20Contract.at(LP_ADDRESS[col]);
  let res = await instance.balanceOf(address)
  let amount = convertByWei(res)
  // console.log('swap lp', col, amount)
  let map = ctx.data.availableLpMap || {}
  map[col] = amount
  ctx.data.availableLpMap = map
  return
}

// total amount in lp contract. function totalSupply
export const getPoolLpSupply = async (col) => {
  if(!LP_ADDRESS[col]){
    return
  }
  const { Erc20Contract } = ctx.data;
  const instance = await Erc20Contract.at(LP_ADDRESS[col]);
  let res = await instance.totalSupply()
  let amount = convertByWei(res)
  // console.log('lp totalSupply', amount)
  let map = ctx.data.poolLpSupplyMap || {}
  map[col] = amount
  ctx.data.poolLpSupplyMap = map
  return
}

// the detail of total amount in lp contract. function getReserves
export const getPoolLpReserve = async (col) => {
  if(!LP_ADDRESS[col]){
    return
  }
  const { LpContract, poolLpReserveMap = {} } = ctx.data;
  const instance = await LpContract.at(LP_ADDRESS[col]);
  let res = await instance.getReserves()
  let amount0 = convertByWei(res._reserve0) // _reserve0, bctoken
  let amount1 = convertByWei(res._reserve1) // _reserve1, paired
  // poolLpReserveMap[col] = [(0.1 * amount0).toFixed(5), (0.1 * amount1).toFixed(5)]
  poolLpReserveMap[col] = [(amount0).toFixed(5), (amount1).toFixed(5)]
  ctx.data.poolLpReserveMap = poolLpReserveMap
  // console.log('lp reserve', poolLpReserveMap)
  return
}