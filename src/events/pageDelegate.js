/**
 * pageDelegate
 */
import Config from '../config';
import ctx from './index';
import { initChain, initTheme, updateAccount, updateSupply, updatePrice, updateApy } from './contracts/accounts';
import { initContract, approveCol, depositAndSwapToPaired, lend, approvePaired, repay, deposit, mmDeposit, redeem, collect } from './contracts/transaction';
import { isNeedApprove, approvedNumAdd } from '../utils'
const { BumperCore, BumperZap, SwapRouter } = Config.CONTRACT_ADDRESS
// const pairedSymbol = Config.paired

ctx.event.listen('showLoading', (message) => {
  ctx.data.showLoading = true;
  ctx.data.loadingMessage = message;
});

ctx.event.listen('hideLoading', () => {
  ctx.data.showLoading = false;
  ctx.data.loadingMessage = '';
});

// changeTheme
ctx.event.listen('changeTheme', (theme) => {
  ctx.data.theme = theme;
});

// initEthereum
ctx.event.listen('initEthereum', async () => {
  ctx.event.emit('showLoading', 'LOADING');
  let breakFlag = await initChain(); // choose chain
  if (breakFlag) {
    ctx.event.emit('hideLoading');
    return
  }
  await initContract(); // init contract
  await initTheme(); // init theme
  const { chainProvider } = ctx.data;
  if (chainProvider) {
    const account = await chainProvider.request({ method: 'eth_accounts' });
    console.log(account, 'account')
    if (account && account.length) {
      await Promise.all([
        new Promise((resolve) => {
          (async () => {
            await updateSupply();
            resolve()
          })();
        }),
        new Promise((resolve) => {
          (async () => {
            await updatePrice();
            resolve()
          })();
        }),
        new Promise((resolve) => {
          (async () => {
            await updateAccount(account);
            resolve()
          })();
        }),
      ]).then(() => {
        updateApy();
      });
    }else{
      setTimeout(()=>{
        window.location.href = '/#/'
      }, 2000)
    }
    ctx.event.emit('hideLoading');
  } else {
    ctx.event.emit('hideLoading');
  }
});

ctx.event.listen('connectWallet', async () => {
  const { chainProvider } = ctx.data;
  if (chainProvider) {
    let account = '';
    try {
      account = await chainProvider.request({ method: 'eth_requestAccounts' });
      ctx.event.emit('showLoading', 'LOADING');
      // 并行处理
      await Promise.all([
        new Promise((resolve) => {
          (async () => {
            await updateSupply();
            resolve()
          })();
        }),
        new Promise((resolve) => {
          (async () => {
            await updatePrice();
            resolve()
          })();
        }),
        new Promise((resolve) => {
          (async () => {
            await updateAccount(account);
            resolve()
          })();
        }),
      ]).then(() => {
        updateApy();
        ctx.event.emit('hideLoading');
      });
    } catch (err) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    }
  }
});

// borrow
ctx.event.listen('depositAndSwapToPaired', async (params) => {
  const { num, col, ext } = params;
  let { approveMap = {}, chainAccount } = ctx.data
  if (isNeedApprove(approveMap, col, 'zap', num)) {
    ctx.event.emit('showLoading', 'APPROVING');
    const result = await approveCol(col, num, BumperZap);
    approveMap[col]['zapStatus'] = true
    approveMap[col]['zapApproved'] = approvedNumAdd(approveMap[col]['zapApproved'], num)
    ctx.data.approveMap = approveMap;
    if (!(result && result.receipt.status)) {
      return;
    }
  } else {
    const result = await depositAndSwapToPaired(col, num, ext)
    console.log('depositAndSwapToPaired', result)
    updateAccount([chainAccount]);
  }
})

// lend
ctx.event.listen('lend', async (params) => {
  const { num, col, ext } = params;
  let { approveMap = {}, chainAccount } = ctx.data
  if (isNeedApprove(approveMap, 'PAIRED', 'swap', num)) {
    ctx.event.emit('showLoading', 'APPROVING');
    const result = await approvePaired(num, SwapRouter);
    approveMap['PAIRED']['swapStatus'] = true;
    approveMap['PAIRED']['swapApproved'] = approvedNumAdd(approveMap['PAIRED']['swapApproved'], num)
    ctx.data.approveMap = approveMap;
    if (!(result && result.receipt.status)) {
      return;
    }
  } else {
    const result = await lend(col, num, ext)
    console.log('lend', result)
    updateAccount([chainAccount]);
  }
})

// deposit
ctx.event.listen('deposit', async (params) => {
  const { num, col, ext } = params;
  let { approveMap = {}, chainAccount } = ctx.data
  if (isNeedApprove(approveMap, col, 'core', num)) {
    ctx.event.emit('showLoading', 'APPROVING');
    const result = await approveCol(col, num, BumperCore);
    approveMap[col]['coreStatus'] = true
    approveMap[col]['coreApproved'] = approvedNumAdd(approveMap[col]['coreApproved'], num)
    ctx.data.approveMap = approveMap;
    if (!(result && result.receipt.status)) {
      return;
    }
  } else {
    const result = await deposit(col, num, ext)
    console.log('deposit', result)
    updateAccount([chainAccount]);
  }
})

ctx.event.listen('mmDeposit', async (params) => {
  const { num, col, ext } = params;
  let { approveMap = {}, chainAccount } = ctx.data
  if (isNeedApprove(approveMap, 'PAIRED', 'core', num)) {
    ctx.event.emit('showLoading', 'APPROVING');
    const result = await approvePaired(num, BumperCore);
    approveMap['PAIRED']['coreStatus'] = true;
    approveMap['PAIRED']['coreApproved'] = approvedNumAdd(approveMap['PAIRED']['coreApproved'], num)
    ctx.data.approveMap = approveMap;
    if (!(result && result.receipt.status)) {
      return;
    }
  } else {
    const result = await mmDeposit(col, num, ext)
    console.log('mmDeposit', result)
    updateAccount([chainAccount]);
  }
})


ctx.event.listen('repay', async (params) => {
  const { num, col, ext } = params;
  let { approveMap = {}, chainAccount } = ctx.data
  if (isNeedApprove(approveMap, 'PAIRED', 'core', num)) {
    ctx.event.emit('showLoading', 'APPROVING');
    const result = await approvePaired(num, BumperCore);
    approveMap['PAIRED']['coreStatus'] = true;
    approveMap['PAIRED']['coreApproved'] = approvedNumAdd(approveMap['PAIRED']['coreApproved'], num)
    ctx.data.approveMap = approveMap;
    if (!(result && result.receipt.status)) {
      return;
    }
  } else {
    const result = await repay(col, num, ext)
    console.log('repay', result)
    updateAccount([chainAccount]);
  }
})

ctx.event.listen('redeem', async (params) => {
  const { num, col, ext } = params;
  const result = await redeem(col, num, ext)
  console.log('redeem', result)
  updateAccount([ctx.data.chainAccount]);
})

ctx.event.listen('collect', async (params) => {
  const { num, col, ext } = params;
  const result = await collect(col, num, ext)
  console.log('collect', result)
  updateAccount([ctx.data.chainAccount]);
})
