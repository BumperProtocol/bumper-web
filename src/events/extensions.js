export default [
  {
    name: 'default',
    data: {
      // web3
      web3: 1,
      // eth
      chainProvider: 1,
      // account
      chainAccount: 1,
      // loading
      showLoading: 1,
      // loadingMessage
      loadingMessage: 1,
      // theme
      theme: 'dark', // 1 light，0 dark
    }
  },
  {
    name: 'contract',
    data: {
      // zap
      BumperZapContract: 1,
      // btoken
      BTokenContract: 1,
      // lp
      LpContract: 1,
      // approve
      approveMap: 1,
      // lp approve
      approveLpMap: 1,
    }
  },
  {
    name: 'assets',
    data: {
      colAmtMap: {}, // col
      pairedAmt: 1, // paired
      bTokenMap: {}, // btoken
      availableLpMap: {} // available lp
    }
  },
  {
    name: 'poolTotal',
    data: {
      poolLpReserveMap: {}, // the reverse value of the two tokens in lp contract. return an array. e.g. [bctoken, paired]
      poolLpSupplyMap: {} // the totalSupply value of lp contract
    }
  },
  {
    name: 'price',
    data: {
      colPriceMap:{},
      bcPriceMap: {}
    }
  },
  {
    name: 'apy',
    data: {
      lendApyMap: {},
      borrowApyMap: {}
    }
  },
];
