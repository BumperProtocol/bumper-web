const ETH_TO_WEI = window.BigInt(Math.pow(10, 18));

// 1000000000000000000 --> 1
export const convertByWei = (wei) => {
  const bigWei = window.BigInt(wei);
  // 保留5位小数
  return window.Number(bigWei * 100000n / ETH_TO_WEI) / 100000;
};
// 1 --> 1000000000000000000
export const convertByEth = (eth) => {
  return window.BigInt(Math.round(eth * Math.pow(10, 18)))
};
