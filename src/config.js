const Config = {
  BaseApi: '',
  ScanUrl: 'https://bscscan.com/',
  whitepaperLink: '',
  githubLink: '',
  twitterLink: '',
  mediumLink: '',
  telegramLink: '',
  docLink: '',
  SlippageTolerance: 10, //10%
  // env
  NETWORK: 56,
  SwapUrl: 'https://exchange.pancakeswap.finance/#/',
  // col contract address
  COL_ADDRESS: {
    'ETH':'0x2170ed0880ac9a755fd29b2688956bd959f933f8',
  },
  // btoken contract address
  BTOKEN_ADDRESS: {
    'ETH-1624982400': {
      'BRTOKEN': '0x51aFe7e144E384f819B25f05E6Aa90dB2667287a',
      'BCTOKEN': '0xfee8e028C40fd147c26b07CED0aA200e5B2cD5d7',
    },
  },
  //contract address
  CONTRACT_ADDRESS: {
    'PAIRED': '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD
    'BumperCore': '0x224E53813c9eC667a0fdd8C280497Cf4FC3A316E',
    'BumperZap': '0x2971F8785d56990aC6384F5bDFf81d21F55e9ae5',
    'SwapRouter': '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    'BumperFarm': '',
  },
  // lp contract address（bctoken+paired)
  LP_ADDRESS: {
  },
  // lp contract address（col+paired)
  PRICE_ADDRESS: {
    'ETH': '0xEa26B78255Df2bBC31C1eBf60010D78670185bD0' // ETH-USDC
  },
  PairedSymbol: 'BUSD',
  MARKET_POOL_LIST: [
    {
      colE: 'ETH-1624982400',
      col: 'ETH',
      expiry: 1624982400,
      mintRatio: '1500',
      lpReady: false,
      'pool': 'WBNB - BC_ETH_150_WBNB_20210630',
      rewardPerWeek: 0
    }
  ]
};

export default Config;
