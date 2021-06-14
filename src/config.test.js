const Config = {
  BaseApi: '',
  ScanUrl: 'https://testnet.bscscan.com/',
  whitepaperLink: '',
  githubLink: '',
  twitterLink: '',
  mediumLink: '',
  telegramLink: '',
  docLink: '',
  SlippageTolerance: 10, //10%
  // env
  NETWORK: 97,
  SwapUrl: 'https://trade.bscswap.com/#/',
  // col contract address
  COL_ADDRESS: {
    'BTCB': '0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8',
    'ETH':'0xd66c6b4f0be8ce5b39d52e0fd1344c389929b378',
  },
  // btoken contract address
  BTOKEN_ADDRESS: {
    'BTCB-1624982400': {
      'BRTOKEN': '0x557C1420655d57a35d66a9c84d1060Fe54f2314D',
      'BCTOKEN': '0x938ef38099Bc277c7B8E13dBeD37333284CA5101',
    },
    'ETH-1624982400': {
      'BRTOKEN': '0x452c7981A0051Dfe72A719fF56d016F4C2925629',
      'BCTOKEN': '0x7BBe6Fd98b6e55e695867fb969349d152b2126bC',
    },
    'ETH-1627574400': {
      'BRTOKEN': '0x835c43A493Ca573C97D14a055CbA79eEBa479C74',
      'BCTOKEN': '0x642Aa0Fb8FFe4DA71f604041a26825F810d3030d',
    },
  },
  //contract address
  CONTRACT_ADDRESS: {
    'PAIRED': '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    'BUMPER': '0xCce7696a73f0463BDC6f438bEB2721Be28CAd1Df',
    'BumperCore': '0x5B3c58529393B398FCE090E637c31fCD392d8306',
    'BumperZap': '0xa2045390EB731d1c9a4010F08B3e6c0c94d396ca',
    'SwapRouter': '0xd954551853f55deb4ae31407c423e67b1621424a',
    'BumperFarm': '0x3a75BcC6B2c330B91e478C7AA4e3D0b199d04155',
  },
  // lp contract address（bctoken+paired)
  LP_ADDRESS: {
    'BTCB-1624982400':'0x6c2d56cf402768381781550ba4f982db027c3361',
    'ETH-1624982400':'0x4b58e1a2937161d7678a0c9dec3925fd9a43dbd8',
    //'ETH-1627574400':'0x4b58e1a2937161d7678a0c9dec3925fd9a43dbd8'
  },
  // lp contract address（col+paired)
  PRICE_ADDRESS: {
    'BTCB' : '0xce4c703611e906156d16363c533e7f38191466f2', // BTCB2WBNB
    'ETH': '0xa52827e962edfadfd7ad856e7f4c6dabe102093d', // WBNB2ETH
    'WBNB2BUMPER' : '0x134a2a92f6611cefb68a39dfb13e0b5a88150535'
  },
  PairedSymbol: 'WBNB',
  MARKET_POOL_LIST: [
    {
      colE: 'BTCB-1624982400',
      col: 'BTCB',
      expiry: 1624982400,
      mintRatio: 35.00,
      pool: 'WBNB - BC_BTCB_35_WBNB_20210630',
      rewardPerWeek: 0
    },
    {
      colE: 'ETH-1624982400',
      col: 'ETH',
      colIndex:1,
      expiry: 1624982400,
      mintRatio: '150',
      'pool': 'WBNB - BC_ETH_150_WBNB_20210630',
      rewardPerWeek: 0
    },
    {
      colE: 'ETH-1627574400',
      col: 'ETH',
      colIndex:1,
      expiry: 1627574400,
      mintRatio: '150',
      lpReady: false,
      'pool': 'WBNB - BC_ETH_150_WBNB_20210630',
      rewardPerWeek: 0
    }
  ]
};

export default Config;
