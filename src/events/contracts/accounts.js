// import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { ETH_NETWORK } from './constants';
import Config from '../../config';
import ctx from '../index';
import { showConfirm } from '../../components/Modal';
import { getColAmt, getPairedAmt, getBTokenAmt, isApproveCol, isApprovePaired } from './transaction';
import { getPoolLpSupply, getPoolLpReserve } from './farmTransaction';
import { getColPrice, getBcTokenPrice } from './price';
import { getLendApy, getBorrowApy } from './apy';
import { alertError, getDefaultTheme } from '../../utils';

const crt_net = Config.NETWORK
const MARKET_POOL_LIST = Config.MARKET_POOL_LIST

// init metamask
export const initChain = async () => {
  // loading @metamask
  const detectEthereumProvider = await import(
    /* webpackChunkName: 'metamask' */
    '@metamask/detect-provider'
  ).then(m => m.default);
  // Detect the MetaMask Ethereum provider
  // this returns the provider, or null if it wasn't detected
  const provider = await detectEthereumProvider();
  if (provider) {
    if (provider === window.ethereum) {
      ctx.data.chainProvider = provider;
      const network = await provider.request({
        method: 'net_version',
        params: [],
      });
      console.log('current network is:', network, ETH_NETWORK[network]);
      if (crt_net !== Number(network)) {
        alertError('please change to correct network')
        return 1
      }
      // register web3 provider
      ctx.data.web3 = new Web3(provider);
    } else {
      showConfirm({
        title: 'Please only use MetaMask!',
        content: 'Do you have multiple wallets installed?',
        onOk() {
          window.location.href = 'https://metamask.io/download.html';
        }
      });
    }
  } else {
    // ctx.data.web3 = new Web3.providers.HttpProvider("http://localhost:8545");
    showConfirm({
      title: 'Please install MetaMask!',
      content: 'You have not install MetaMask, jump link to install?',
      onOk() {
        window.location.href = 'https://metamask.io/download.html';
      }
    });
  }
};

export const initTheme = () => {
  let defaultTheme = getDefaultTheme();
  ctx.data.theme = defaultTheme;
}

// updateAccount
export const updateAccount = async (account) => {
  console.log('updateAccount market......');
  if (account && account.length) {
    const chainAccount = account[0];
    if (!ctx.data.chainAccount) {
      ctx.data.chainAccount = chainAccount;
    }
    // paired
    await getPairedAmt(chainAccount);
    await Promise.all([
      new Promise((resolve) => {
        (async () => {
          // approve
          await isApproveCol(); 
          await isApprovePaired();
          resolve()
        })();
      }),
      new Promise((resolve) => {
        (async () => {
          for (let item of MARKET_POOL_LIST) {
            await getColAmt(item.col, chainAccount);
          }
          resolve()
        })();
      }),
      new Promise((resolve) => {
        (async () => {
          for (let item of MARKET_POOL_LIST) {
            await getBTokenAmt(item.colE, chainAccount);
          }
          resolve()
        })();
      }),
    ]).then(() => { });
  } else {
    ctx.data.chainAccount = 0;
  }
}

// updateSupply
export const updateSupply = async () => {
  console.log('updateSupply ......');
  for (let item of MARKET_POOL_LIST) {
    await Promise.all([
      new Promise((resolve) => {
        (async () => {
          await getPoolLpSupply(item.colE);
          resolve()
        })();
      }),
      new Promise((resolve) => {
        (async () => {
          await getPoolLpReserve(item.colE);
          resolve()
        })();
      })
    ])
  }
}

// updatePrice
export const updatePrice = async () => {
  console.log('updatePrice ......');
  let colIdList = []
  let tmp = []
  for (let item of MARKET_POOL_LIST) {
    await getBcTokenPrice(item.colE);
    if(colIdList.indexOf(item.col)===-1){
      colIdList.push(item.col)
      tmp.push(item)
    }
  }
  for (let item of tmp) {
    await getColPrice(item.col, item.colIndex);
  }
}

// updateApy
export const updateApy = async () => {
  console.log('updateApy ......');
  for (let item of MARKET_POOL_LIST) {
    await Promise.all([
      new Promise((resolve) => {
        (async () => {
          if(item.lpReady){
            await getLendApy(item.colE, item.expiry);
          }
          resolve()
        })();
      }),
      new Promise((resolve) => {
        (async () => {
          if(item.lpReady){
            await getBorrowApy(item.colE, item.expiry);
          }
          resolve()
        })();
      })
    ])
  }
}