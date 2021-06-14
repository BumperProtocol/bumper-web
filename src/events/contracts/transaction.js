import Config from '../../config';
import ctx from '../index';
import { convertByWei, convertByEth, alertSuccess, alertError } from '../../utils';
// config
const { COL_ADDRESS, BTOKEN_ADDRESS, CONTRACT_ADDRESS } = Config
const { PAIRED, BumperCore, BumperZap, SwapRouter } = CONTRACT_ADDRESS
// temp
// 1640995200
// const expiry = Math.floor((new Date('2022-01-01')).getTime() / 1000);
// 1000000000000000000
// const mintRatio = '1000000000000000000';

const getErc20Json = async () => {
  const result = await fetch(`${Config.BaseApi}/ERC20.json`);
  return await result.json();
};
const getBumperCoreJson = async () => {
  const result = await fetch(`${Config.BaseApi}/BumperCore.json`);
  return await result.json();
};
const getBumperZapJson = async () => {
  const result = await fetch(`${Config.BaseApi}/BumperZap.json`);
  return await result.json();
};
const getBTokenJson = async () => {
  const result = await fetch(`${Config.BaseApi}/bToken.json`);
  return await result.json();
};
const getRouterJson = async () => {
  const result = await fetch(`${Config.BaseApi}/IRouter.json`);
  return await result.json();
};
const getLpJson = async () => {
  const result = await fetch(`${Config.BaseApi}/lp.json`);
  return await result.json();
};

// initContract
export const initContract = async () => {
  const { chainProvider } = ctx.data;
  if (!chainProvider) {
    console.error('chainProvider not inited');
    return;
  }

  // const TruffleContract = await import(
  //   /* webpackChunkName: 'truffle' */
  //   '@truffle/contract'
  // ).then(m => m.default);
  const TruffleContract = window.TruffleContract;

  // col/paired
  const erc20 = await getErc20Json();
  const Erc20Contract = TruffleContract(erc20);
  Erc20Contract.setProvider(chainProvider);
  ctx.data.Erc20Contract = Erc20Contract;

  // btoken
  const bTokenJSON = await getBTokenJson();
  const BTokenContract = TruffleContract(bTokenJSON);
  BTokenContract.setProvider(chainProvider);
  ctx.data.BTokenContract = BTokenContract;

  // bumperCore
  const BumperCoreJSON = await getBumperCoreJson();
  const BumperCoreContract = TruffleContract(BumperCoreJSON);
  BumperCoreContract.setProvider(chainProvider);
  ctx.data.BumperCoreContract = BumperCoreContract;

  // bumperZap
  const BumperZapJSON = await getBumperZapJson();
  const BumperZapContract = TruffleContract(BumperZapJSON);
  BumperZapContract.setProvider(chainProvider);
  ctx.data.BumperZapContract = BumperZapContract;

  // swapRouter
  const routerJSON = await getRouterJson();
  const SwapRouterContract = TruffleContract(routerJSON);
  SwapRouterContract.setProvider(chainProvider);
  ctx.data.SwapRouterContract = SwapRouterContract;

  // lp
  const lpJson = await getLpJson();
  const LpContract = TruffleContract(lpJson);
  LpContract.setProvider(chainProvider);
  ctx.data.LpContract = LpContract;
}

export const getColAmt = async (col, address) => {
  const { Erc20Contract} = ctx.data;
  let map = ctx.data.colAmtMap || {}
  const btcbIns = await Erc20Contract.at(COL_ADDRESS[col]);
  let res = await btcbIns.balanceOf(address)
  let amount = convertByWei(res)
  // console.log('colAmt', col, amount)
  map[col] = amount
  ctx.data.colAmtMap = map
  return
}

export const getPairedAmt = async (address) => {
  const { Erc20Contract } = ctx.data;
  const btcbIns = await Erc20Contract.at(PAIRED);
  let res = await btcbIns.balanceOf(address)
  let amount = convertByWei(res)
  // console.log('paired', amount)
  ctx.data.pairedAmt = amount
  return amount
}

export const getBTokenAmt = async (col, address) => {
  const { BTokenContract } = ctx.data;
  let res, brAmt, bcAmt;
  const brIns = await BTokenContract.at(BTOKEN_ADDRESS[col]['BRTOKEN']);
  res = await brIns.balanceOf(address)
  brAmt = convertByWei(res)
  const bcIns = await BTokenContract.at(BTOKEN_ADDRESS[col]['BCTOKEN']);
  res = await bcIns.balanceOf(address)
  bcAmt = convertByWei(res)
  let map = ctx.data.bTokenMap || {}
  map[col]={
    'BRTOKEN':brAmt,
    'BCTOKEN':bcAmt
  }
  ctx.data.bTokenMap = map
  // console.log(col,'br:', brAmt, 'bc', bcAmt)
  return
}

// isApprove
export const isApproveCol = async () => {
  const { Erc20Contract, chainAccount } = ctx.data;
  let map = ctx.data.approveMap || {}
  for(let col of Object.keys(COL_ADDRESS)){
    const colIns = await Erc20Contract.at(COL_ADDRESS[col]);
    map[col] = {}
    // validate
    let res = await colIns.allowance(chainAccount, BumperZap);
    let approveNum = convertByWei(res)
    map[col]['zapStatus'] = approveNum > 0
    map[col]['zapApproved'] = approveNum 
    // validate
    res = await colIns.allowance(chainAccount, BumperCore);
    approveNum = convertByWei(res)
    map[col]['coreStatus'] = approveNum > 0
    map[col]['coreApproved'] = approveNum
  }
  // console.log('approveMap:', map)
  ctx.data.approveMap = map
};

// isApprove
export const isApprovePaired = async () => {
  const { Erc20Contract, chainAccount } = ctx.data;
  let map = ctx.data.approveMap || {}
  const col = 'PAIRED'
  const pairedIns = await Erc20Contract.at(PAIRED);
  map[col] = {}
  // validate
  let res = await pairedIns.allowance(chainAccount, BumperCore);
  let approveNum = convertByWei(res)
  map[col]['coreStatus'] = approveNum > 0
  map[col]['coreApproved'] = approveNum
  // validate
  res = await pairedIns.allowance(chainAccount, SwapRouter);
  approveNum = convertByWei(res)
  map[col]['swapStatus'] = approveNum > 0
  map[col]['swapApproved'] = approveNum
  // console.log('approveMap:', map)
  ctx.data.approveMap = map
};

export const approveCol = async (col, amount, contractAddress) => {
  const colAddress = COL_ADDRESS[col]
  const { Erc20Contract, chainAccount } = ctx.data;
  const colIns = await Erc20Contract.at(colAddress);
  // approve
  try {
    let res = await colIns.approve(
      contractAddress,
      convertByEth(amount),
      {
        from: chainAccount
      }
    );
    alertSuccess('APPROVE SUCCESS');
    return res;
  } catch (err) {
    alertError(err.message)
  } finally {
    ctx.event.emit('hideLoading');
  }
};

export const approvePaired = async (amount, contractAddress, pairedAddress = PAIRED) => {
  const { Erc20Contract, chainAccount } = ctx.data;
  const pairedIns = await Erc20Contract.at(pairedAddress);
  try {
    let res = await pairedIns.approve(
      contractAddress,
      convertByEth(amount),
      {
        from: chainAccount
      }
    );
    alertSuccess('APPROVE SUCCESS');
    return res;
  } catch (err) {
    alertError(err.message)
  } finally {
    ctx.event.emit('hideLoading');
  }
};

export const depositAndSwapToPaired = async (col, num, ext) => {
  ctx.event.emit('showLoading', 'BORROWING');
  const { expiry: e, mintRatio: m, colE } = ext
  const amount = convertByEth(num)
  const { BumperZapContract, chainAccount } = ctx.data;
  const zapInstance = await BumperZapContract.at(BumperZap);
  try {
    const params = [
      COL_ADDRESS[col],
      PAIRED,
      e,
      m,
      amount,
      '0',
      [BTOKEN_ADDRESS[colE]['BCTOKEN'], PAIRED], 
      e
    ]
    let res = await zapInstance.depositAndSwapToPaired(
      ...params,
      {
        from: chainAccount
      }
    );
    alertSuccess('BORROW SUCCESS');
    return res;
  } catch (err) {
    alertError(err.message)
  } finally {
    ctx.event.emit('hideLoading');
  }
};

export const lend = async (col, num, ext) => {
  ctx.event.emit('showLoading', 'LENDING');
  const { expiry: e, colE } = ext
  const amount = convertByEth(num)
  const { SwapRouterContract, chainAccount } = ctx.data;
  const swapInstance = await SwapRouterContract.at(SwapRouter);
  try {
    const params = [
      amount,
      0,
      [PAIRED, BTOKEN_ADDRESS[colE]['BCTOKEN']],
      chainAccount,
      e,
    ]
    let res = await swapInstance.swapExactTokensForTokens(
      ...params,
      {
        from: chainAccount
      }
    );
    alertSuccess('LEND SUCCESS');
    return res;
  } catch (err) {
    alertError(err.message)
  } finally {
    ctx.event.emit('hideLoading');
  }
};

export const deposit = async (col, num, ext) => {
  ctx.event.emit('showLoading', 'DEPOSITING');
  const { expiry: e, mintRatio: m } = ext
  const amount = convertByEth(num)
  const { BumperCoreContract, chainAccount } = ctx.data;
  const coreInstance = await BumperCoreContract.at(BumperCore);
  try {
    const params = [
      COL_ADDRESS[col],
      PAIRED,
      e,
      m,
      amount,
    ]
    let res = await coreInstance.deposit(
      ...params,
      {
        from: chainAccount
      }
    );
    alertSuccess('DEPOSIT SUCCESS');
    return res;
  } catch (err) {
    alertError(err.message)
  } finally {
    ctx.event.emit('hideLoading');
  }
};

// mmDeposit
export const mmDeposit = async (col, num, ext) => {
  ctx.event.emit('showLoading', 'DEPOSITING');
  const { expiry: e, mintRatio: m } = ext
  const amount = convertByEth(num)
  const { BumperCoreContract, chainAccount } = ctx.data;
  const coreInstance = await BumperCoreContract.at(BumperCore);
  try {
    const params = [
      COL_ADDRESS[col],
      PAIRED,
      e,
      m,
      amount,
    ]
    let res = await coreInstance.mmDeposit(
      ...params,
      {
        from: chainAccount
      }
    );
    alertSuccess('MMDEPOSIT SUCCESS');
    return res;
  } catch (err) {
    alertError(err.message)
  } finally {
    ctx.event.emit('hideLoading');
  }
};

// repay, brtoken+paired
export const repay = async (col, num, ext) => {
  ctx.event.emit('showLoading', 'REPAYING');
  const { expiry: e, mintRatio: m } = ext
  const amount = convertByEth(num)
  const { BumperCoreContract, chainAccount } = ctx.data;
  const coreInstance = await BumperCoreContract.at(BumperCore);
  try {
    const params = [
      COL_ADDRESS[col],
      PAIRED,
      e,
      m,
      amount,
    ]
    let res = await coreInstance.repay(
      ...params,
      {
        from: chainAccount
      }
    );
    alertSuccess('REPAY SUCCESS');
    return res;
  } catch (err) {
    alertError(err.message)
  } finally {
    ctx.event.emit('hideLoading');
  }
};

// redeem, brtoken+bctoken
export const redeem = async (col, num, ext) => {
  ctx.event.emit('showLoading', 'REDEEMING');
  const { expiry: e, mintRatio: m } = ext
  const amount = convertByEth(num)
  const { BumperCoreContract, chainAccount } = ctx.data;
  const coreInstance = await BumperCoreContract.at(BumperCore);
  try {
    const params = [
      COL_ADDRESS[col],
      PAIRED,
      e,
      m,
      amount,
    ]
    let res = await coreInstance.redeem(
      ...params,
      {
        from: chainAccount
      }
    );
    alertSuccess('REDEEM SUCCESS');
    return res;
  } catch (err) {
    alertError(err.message)
  } finally {
    ctx.event.emit('hideLoading');
  }
};

// collect, bctoken
export const collect = async (col, num, ext) => {
  ctx.event.emit('showLoading', 'COLLECTING');
  const { expiry: e, mintRatio: m } = ext
  const amount = convertByEth(num)
  const { BumperCoreContract, chainAccount } = ctx.data;
  const coreInstance = await BumperCoreContract.at(BumperCore);
  try {
    const params = [
      COL_ADDRESS[col],
      PAIRED,
      e,
      m,
      amount,
    ]
    let res = await coreInstance.collect(
      ...params,
      {
        from: chainAccount
      }
    );
    alertSuccess('COLLECT SUCCESS');
    return res;
  } catch (err) {
    alertError(err.message)
  } finally {
    ctx.event.emit('hideLoading');
  }
};
