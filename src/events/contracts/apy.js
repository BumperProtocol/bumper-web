import ctx from '../index';

// 1 paired can lend for （1/bcPrice）bctoken, after expriy, 1 bctoken can exchange 1 paired. so total is （1/bcPrice）paired, the interest is （1 / bcPrice）- 1
export const getLendApy = async (col, expiry) => {
  const { bcPriceMap } = ctx.data;
  const bcPrice = bcPriceMap[col]
  const now = Math.floor((new Date()).getTime() / 1000);
  const interest = (1 / bcPrice) - 1
  const duration = (expiry - now) / (60 * 60 * 24)
  let map = ctx.data.lendApyMap || {}
  map[col] = duration > 0 ? Math.round((10000 * interest / duration) * 365) / 100 : 0
  ctx.data.lendApyMap = map
  return
}

// after expiry I should repay 1 paired for 1 bctoken, so now I can get (1*bcPrice) paired, so the interest is 1 - bcPrice
export const getBorrowApy = async (col, expiry) => {
  const { bcPriceMap } = ctx.data;
  const bcPrice = bcPriceMap[col]
  const now = Math.floor((new Date()).getTime() / 1000);
  const interest = (1 - 1 * bcPrice)
  const duration = (expiry - now) / (60 * 60 * 24) 
  let map = ctx.data.borrowApyMap || {}
  map[col] = duration > 0 ?  Math.round((10000 * interest / duration) * 365) / 100 : 0
  ctx.data.borrowApyMap = map
  return
}

