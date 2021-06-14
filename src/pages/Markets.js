// bumper
import { useEffect, useState } from 'react';
import { Switch, Tooltip } from 'antd';
import './Markets.scss';
import Config from '../config';
import ctx, { mapData, unmapActions } from '../events';
import { checkOpValid, getDefaultTheme, MARKET_TABLE_HEADER, calPriceImpact, alertError, getDateText, convertByEth } from '../utils'
import Input from '../components/Input';
import PercentBox from '../components/PercentBox';
import ICON_PAIRED from '../resources/logo-usdt.png';
import ICON_BTC from '../resources/logo-btc.png';
import ICON_ETH from '../resources/logo-eth.png';
const { PairedSymbol, BTOKEN_ADDRESS, CONTRACT_ADDRESS, MARKET_POOL_LIST, SlippageTolerance } = Config
const pairedAdress = CONTRACT_ADDRESS['PAIRED']

const Row = (props) => {
  const { item, theme, colAmt = 0, bcAssetsMap = {}, pairedAmt, bcPrice, colPrice, lendApy: lend, borrowApy: borrow, supply = [], changeVisible, setIndex, updateOpNum, handleOp, goSwap, onDepositChange } = props;
  const { col, colE, mintRatio, expiry, lpReady = true, opVisible, opNum, depositCheck = false, borrowInterest = 0, lendInterest = 0, impact = 0, impactLimit = false } = item;
  let { index } = item;
  const brAmt = bcAssetsMap['BRTOKEN']
  const bcAmt = bcAssetsMap['BCTOKEN']
  const [bcSupply, pairedSupply] = supply
  const borrowPairedValue = (bcPrice * bcSupply * 0.1).toFixed(5)
  const lendPairedValue = (pairedSupply * 0.1).toFixed(5)
  const logo = col === 'BTCB' ? ICON_BTC : ICON_ETH
  const logoPaired = ICON_PAIRED
  const expiryText = getDateText(expiry)
  const mintRatioInWei = convertByEth(mintRatio)
  const ext = {
    col,
    colE,
    mintRatio: mintRatioInWei,
    expiry,
    impactLimit
  }
  const expiryFlag = Math.round((new Date()).getTime() / 1000) > Number(expiry)
  if (expiryFlag) { index = 'collect' }
  if( !lpReady) {index='mint'}

  return (
    <>
      <tbody className={`${opVisible ? 'bg-' + theme + '-inner' : 'bg-' + theme}`}>
        <tr onClick={() => { changeVisible(opVisible, item) }}>
          <td className="titleTd">
            <div className="market-cell">
              <u className="card-img-u">
                <div className="card-img-box">
                  <div className="col-img-wrap">
                    <div className="col-img">
                      <img alt="" src={logo} />
                    </div>
                  </div>
                  <div className="paired-img-wrap">
                    <div className="paired-img">
                      <img alt="" src={logoPaired} />
                    </div>
                  </div>
                </div>
              </u>
              <div>
                <div>
                  {col}
                  <span className="card-title dotted"> -${colPrice}</span>
                  &nbsp;|&nbsp;
                  {PairedSymbol}
                </div>
                <div>Mint Ratio: {mintRatio}</div>
              </div>
            </div>
          </td>
          <td>{expiryText}</td>
          <td>{lend}%<br />{borrow}%</td>
          <td>
            <div className="btokenTd">
              <span className="fz07">bcToken: </span>{bcAmt}<br />
              <span className="fz07">brToken: </span>{brAmt}
            </div>
          </td>
        </tr>
        {
          opVisible ? (
            <tr>
              <td colSpan="4">
                <div className={`op-box bg-${theme}-inner`}>
                  <div className="navigator">
                    {
                      !expiryFlag ?
                        <>
                          {
                            lpReady ?
                              <>
                                <div className={`navtab ${index === 'borrow' ? 'active' : ''}`} onClick={() => { setIndex('borrow', item) }}>Borrow</div>
                                <div className={`navtab ${index === 'lend' ? 'active' : ''}`} onClick={() => { setIndex('lend', item) }}>Lend</div>
                                <div className={`navtab ${index === 'mint' ? 'active' : ''}`} onClick={() => { setIndex('mint', item) }}>Mint</div>
                              </> :
                              <div className={`navtab ${index === 'mint' ? 'active' : ''}`} onClick={() => { setIndex('mint', item) }}>Mint</div>
                          }
                          {
                            lpReady && brAmt && bcAmt ?
                              <div className={`navtab ${index === 'repay' ? 'active' : ''}`} onClick={() => { setIndex('repay', item) }}>Repay</div> : null
                          }
                          {
                            lpReady && bcAmt ?
                              <div className={`navtab ${index === 'redeem' ? 'active' : ''}`} onClick={() => { setIndex('redeem', item) }}>Redeem</div> : null
                          }
                        </> :
                        <div className={`navtab ${index === 'collect' ? 'active' : ''}`} onClick={() => { setIndex('collect', item) }}>Collect</div>
                    }
                  </div>
                  {
                    // borrow tab
                    index === 'borrow' ? (
                      <div>
                        <div className="op-tips">Supply: {lendPairedValue} {PairedSymbol}</div>
                        <div className="op-row2">
                          <div className="op-row2-l">Available: <span className="bRed">{colAmt}</span> {col}</div>
                          <PercentBox balance={colAmt} theme={theme} onClick={(opNum) => { updateOpNum(opNum, item, 'borrow', supply) }} />
                        </div>
                        <div className="op-row3">
                          <Input
                            className="mine-input"
                            token={col}
                            value={opNum}
                            onChange={(opNum) => { updateOpNum(opNum, item, 'borrow', supply) }}
                            balance={colAmt}
                            theme={theme}
                          />
                        </div>
                        <div className="op-tips">Deposit
                    <span className="bRed"> {col} </span>to Borrow
                    <span className="bGreen"> {PairedSymbol} </span>
                        </div>
                        {
                          opNum ?
                            <div>
                              <div className="op-tips yellow">Interested Owed Before Expiry: {borrowInterest} {PairedSymbol}</div>
                              <div className="op-tips yellow">Annualized Interest Rate: {borrow}%</div>
                              <div className="op-tips yellow" style={{ marginTop: '8px' }}>Price Impact: {impact}%</div>
                            </div>
                            : null
                        }
                        <div className="op-btn-row">
                          <button className={`op-btn-base op-btn ${opNum && (!impactLimit) ? '' : 'disabled'}`} onClick={() => { handleOp(col, 'borrow', opNum, ext) }}>Confirm Borrow</button>
                        </div>
                      </div>
                    ) : null
                  }
                  {
                    // lend tab
                    index === 'lend' ? (
                      <div>
                        <div className="op-tips">Demand: {borrowPairedValue} {PairedSymbol}</div>
                        <div className="op-row2">
                          <div className="op-row2-l">Available: <span className="bRed">{pairedAmt}</span> {PairedSymbol}</div>
                          <PercentBox balance={pairedAmt} theme={theme} onClick={(opNum) => { updateOpNum(opNum, item, 'lend', supply) }} />
                        </div>
                        <div className="op-row3">
                          <Input
                            className="mine-input"
                            token={PairedSymbol}
                            value={opNum}
                            onChange={(opNum) => { updateOpNum(opNum, item, 'lend', supply) }}
                            balance={pairedAmt}
                            theme={theme}
                          />
                        </div>
                        <div className="op-tips">Lend
                    <span className="bRed"> {PairedSymbol} </span> for
                    <span className="bGreen"> bcTokens </span>
                        </div>
                        {
                          opNum ?
                            <div>
                              <div className="op-tips yellow">Interested Owed Before Expiry: {lendInterest} WBNB</div>
                              <div className="op-tips yellow">Annualized Interest Rate: {lend}%</div>
                              <div className="op-tips yellow" style={{ marginTop: '8px' }}>Price Impact: {impact}%</div>
                            </div>
                            : null
                        }
                        <div className="op-btn-row">
                          <button className={`op-btn-base op-btn ${opNum && (!impactLimit) ? '' : 'disabled'} `} onClick={() => { handleOp(col, 'lend', opNum, ext) }}>Confirm Lend</button>
                          <button className='op-btn-base op-btn-liquidity' onClick={() => { goSwap(colE) }}>+ Liquidity</button>
                        </div>
                      </div>
                    ) : null
                  }
                  {
                    // deposit tab
                    index === 'mint' ? (
                      <div>
                        <div className="op-tips">{depositCheck ? `Deposit ${col} to mint bcTokens and brTokens` : `Deposit ${PairedSymbol} to mint bcTokens`} </div>
                        <div className="op-tips yellow">
                          {depositCheck ? `1 ${col} mints 25000 bcTokens and brTokens. It will NOT receive Lend APY, use Lend to earn Lend APY` :
                            `1 ${PairedSymbol} mints 1 bcToken. It will NOT receive Lend APY, use Lend to earn Lend APY`}</div>
                        <div className='tal'>
                          <Switch checked={depositCheck} onChange={() => { onDepositChange(depositCheck, item) }} />
                    &nbsp;&nbsp;Use {col}
                        </div>
                        <div className="op-row2">
                          <div className="op-row2-l">Available: <span className="bRed">{depositCheck ? colAmt : pairedAmt}</span> {depositCheck ? col : PairedSymbol}</div>
                          <PercentBox balance={depositCheck ? colAmt : pairedAmt} theme={theme} onClick={(opNum) => { updateOpNum(opNum, item) }} />
                        </div>
                        <div className="op-row3">
                          <Input
                            className="mine-input"
                            token={depositCheck ? col : PairedSymbol}
                            value={opNum}
                            onChange={(opNum) => { updateOpNum(opNum, item) }}
                            balance={depositCheck ? colAmt : pairedAmt}
                            theme={theme}
                          />
                        </div>
                        {
                          depositCheck ?
                            <div className="op-tips">Deposit
                    <span className="bRed"> {col} </span> for
                  <span className="bGreen"> bcTokens </span>&
                  <span className="bGreen"> brTokens </span>
                            </div>
                            :
                            <div className="op-tips">Deposit
                      <span className="bRed"> {PairedSymbol} </span>for
                      <span className="bGreen"> bcToken </span>
                            </div>
                        }
                        <div className="op-btn-row">
                          <button className={`op-btn-base op-btn ${opNum ? '' : 'disabled'} `} onClick={() => { handleOp(col, depositCheck ? 'deposit' : 'mmDeposit', opNum, ext) }}>Confirm Deposit</button>
                          <button className='op-btn-base op-btn-liquidity' onClick={() => { goSwap(colE) }}>+ Liquidity</button>
                        </div>
                      </div>
                    ) : null
                  }
                  {
                    // repay tab
                    index === 'repay' ? (
                      <div>
                        <div className="op-row2">
                          <div className="op-row2-l">Available: <span className="bRed">{brAmt}</span> brToken</div>
                          <PercentBox balance={brAmt} theme={theme} onClick={(opNum) => { updateOpNum(opNum, item) }} />
                        </div>
                        <div className="op-row3">
                          <Input
                            className="mine-input"
                            token={'brToken'}
                            value={opNum}
                            onChange={(opNum) => { updateOpNum(opNum, item) }}
                            balance={brAmt}
                            theme={theme}
                          />
                        </div>
                        <div className="op-btn-row">
                          <button className={`op-btn-base op-btn ${opNum ? '' : 'disabled'}`} onClick={() => { handleOp(col, 'repay', opNum, ext) }}>Confirm Repay</button>
                        </div>
                      </div>
                    ) : null
                  }
                  {
                    // redeem tab
                    index === 'redeem' ? (
                      <div>
                        <div className="op-row2">
                          <div className="op-row2-l">Available: <span className="bRed">{brAmt}</span> brToken, <span className="bRed">{bcAmt}</span> bcToken</div>
                          <PercentBox balance={Math.min(brAmt, bcAmt)} theme={theme} onClick={(opNum) => { updateOpNum(opNum, item) }} />
                        </div>
                        <div className="op-row3">
                          <Input
                            className="mine-input"
                            token={'bToken'}
                            value={opNum}
                            onChange={(opNum) => { updateOpNum(opNum, item) }}
                            balance={Math.min(brAmt, bcAmt)}
                            theme={theme}
                          />
                        </div>
                        <div className="op-btn-row">
                          <button className={`op-btn-base op-btn ${opNum ? '' : 'disabled'}`} onClick={() => { handleOp(col, 'redeem', opNum, ext) }}>Confirm Redeem</button>
                        </div>
                      </div>
                    ) : null
                  }
                  {
                    // collect tab
                    index === 'collect' ? (
                      <div>
                        <div className="op-row2">
                          <div className="op-row2-l">Available: <span className="bRed">{bcAmt}</span> bcToken</div>
                          <PercentBox balance={bcAmt} theme={theme} onClick={(opNum) => { updateOpNum(opNum, item) }} />
                        </div>
                        <div className="op-row3">
                          <Input
                            className="mine-input"
                            token={'bcToken'}
                            value={opNum}
                            onChange={(opNum) => { updateOpNum(opNum, item) }}
                            balance={bcAmt}
                            theme={theme}
                          />
                        </div>
                        <div className="op-btn-row">
                          <button className={`op-btn-base op-btn ${opNum ? '' : 'disabled'}`} onClick={() => { handleOp(col, 'collect', opNum, ext) }}>Confirm collect</button>
                        </div>
                      </div>
                    ) : null
                  }
                </div>
              </td>
            </tr>
          ) : null
        }
      </tbody>
    </>
  )
}

const PageView = () => {
  let defaultTheme = getDefaultTheme();
  const [theme, setTheme] = useState(defaultTheme);
  const [list, setList] = useState([]);

  const [assetsMap, setAssetsMap] = useState({
    'btcb': {},
    'eth': {}
  }); // col
  const [pairedAmt, setPairedAmt] = useState(0); // paired
  const [priceMap, setPriceMap] = useState({});
  const [lendApyMap, setLendApyMap] = useState({});
  const [borrowApyMap, setBorrowApyMap] = useState({});
  const [supplyMap, setSupplyMap] = useState({});

  //switch
  const [switchMy, setSwitchMy] = useState(false);
  const [switchInActive, setSwitchInActive] = useState(false);

  useEffect(() => {
    const list = getValidPoolList()
    for (let item of list) {
      item.opVisible = false
      item.index = 'borrow'
      item.opNum = 0
    }
    setList(list)
  }, []);

  // init
  useEffect(() => {
    const lifetimeObj = {};

    mapData({
      theme(value) {
        setTheme(value)
      },
      // paired
      pairedAmt(value) {
        setPairedAmt(value)
      },
      // col
      colAmtMap(value) {
        for (let item of MARKET_POOL_LIST) {
          if (value[item.col]) {
            assetsMap[item.col] = value[item.col]
          }
        }
        setAssetsMap(Object.assign({}, assetsMap))
      },
      // btoken
      bTokenMap(value) {
        for (let item of MARKET_POOL_LIST) {
          if (value[item.colE]) {
            assetsMap[item.colE] = {}
            assetsMap[item.colE]['BRTOKEN'] = value[item.colE]['BRTOKEN']
            assetsMap[item.colE]['BCTOKEN'] = value[item.colE]['BCTOKEN']
          }
        }
        setAssetsMap(Object.assign({}, assetsMap))
      },
      // supply
      poolLpReserveMap(value) {
        for (let item of MARKET_POOL_LIST) {
          if (value[item.colE]) {
            supplyMap[item.colE] = value[item.colE]
          }
        }
        setSupplyMap(Object.assign({}, supplyMap))
      },
      // 价格
      colPriceMap(value) {
        for (let item of MARKET_POOL_LIST) {
          if (value[item.col]) {
            priceMap[item.col] = value[item.col]
          }
        }
        setPriceMap(Object.assign({}, priceMap))
      },
      bcPriceMap(value) {
        for (let item of MARKET_POOL_LIST) {
          if (value[item.colE]) {
            priceMap[item.colE] = value[item.colE]
          }
        }
        setPriceMap(Object.assign({}, priceMap))
      },
      // apy
      lendApyMap(value) {
        setLendApyMap(Object.assign({}, value))
      },
      borrowApyMap(value) {
        setBorrowApyMap(Object.assign({}, value))
      },
    }, ctx, lifetimeObj);

    return () => {
      unmapActions(lifetimeObj);
    }
  }, []);

  // methods
  const changeVisible = (opVisible, item) => {
    item.opVisible = !opVisible
    setList([].concat(list))
  }

  const setIndex = (index, item) => {
    item.index = index
    setList([].concat(list))
  }

  const updateOpNum = (num, item, type = 'other', supply = []) => {
    item.opNum = num
    const bcPrice = priceMap[item.colE]
    if (type === 'borrow') {
      item.impact = calPriceImpact(num, supply[0], supply[1], item.mintRatio, type)
      item.borrowInterest = (num * Number(item.mintRatio) * (1 - bcPrice)).toFixed(4)
    } else if (type === 'lend') {
      item.impact = calPriceImpact(num, supply[0], supply[1], item.mintRatio, type)
      item.lendInterest = (num * ((1 / bcPrice) - 1)).toFixed(4)
    }
    item.impactLimit = item.impact > SlippageTolerance
    setList([].concat(list))
  }

  const onDepositChange = (check, item) => {
    item.depositCheck = !check
    setList([].concat(list))
  }

  const handleOp = (col, type, opNum, ext) => {
    let valid = checkOpValid(opNum)
    if (!valid) {
      return
    }
    let { impactLimit = false } = ext
    if (impactLimit) {
      alertError('price impact is too large')
      return
    }
    console.log(col, type, opNum, valid)
    if (type === 'borrow') {
      ctx.event.emit('depositAndSwapToPaired', { col, num: opNum, ext });
    }
    if (type === 'lend') {
      ctx.event.emit('lend', { col, num: opNum, ext });
    }
    if (type === 'deposit') {
      ctx.event.emit('deposit', { col, num: opNum, ext });
    }
    if (type === 'mmDeposit') {
      ctx.event.emit('mmDeposit', { col, num: opNum, ext });
    }
    if (type === 'repay') {
      ctx.event.emit('repay', { col, num: opNum, ext });
    }
    if (type === 'redeem') {
      ctx.event.emit('redeem', { col, num: opNum, ext });
    }
    if (type === 'collect') {
      ctx.event.emit('collect', { col, num: opNum, ext });
    }
  }

  const goSwap = (col) => {
    let bctokenAddress = BTOKEN_ADDRESS[col] && BTOKEN_ADDRESS[col]['BCTOKEN']
    let url = Config.SwapUrl + 'add/' + bctokenAddress + '/' + pairedAdress
    window.open(url, '_blank')
  }

  // switch op
  const getValidPoolList = (type = 'valid') => {
    const list = Config.MARKET_POOL_LIST
    let newList = []
    for (let item of list) {
      if (!item.inActiveFlag) {
        newList.push(item)
      }
    }
    return type === 'valid' ? newList : list
  }

  const showMyPosition = () => {
    setSwitchMy(!switchMy)
    const list = getValidPoolList()
    let newList = []
    for (let item of list) {
      item.opVisible = false
      item.index = 'borrow'
      item.opNum = 0
      if (!switchMy) {
        const bcAssets = assetsMap[item.colE]
        const brAmt = bcAssets['BRTOKEN']
        const bcAmt = bcAssets['BCTOKEN']
        if (brAmt || bcAmt) {
          newList.push(item)
        }
      } else {
        newList.push(item)
      }
    }
    setList(newList)
  }
  const showInActive = () => {
    setSwitchInActive(!switchInActive)
    const list = getValidPoolList(!switchInActive ? 'all' : 'valid')
    for (let item of list) {
      item.opVisible = false
      item.index = 'borrow'
      item.opNum = 0
    }
    setList(list)
  }

  return (
    <div className="page-center" style={{ justifyContent: 'flex-start', paddingTop: '40px', padding: '8px 16px', width: '100%' }}>
      <div className="flex" style={{ width: '100%' }}>
        <div className="flex1 tal">
          <Switch checked={switchInActive} onChange={() => { showInActive() }} />
                    &nbsp;Show inactive pairs
        </div>
        <div className="flex1 tar">
          <Switch checked={switchMy} onChange={() => { showMyPosition() }} />
                    &nbsp;Only show my positions
        </div>
      </div>
      <div className={`card bg-${theme}`}>
        <div className="card-container">
          <table className="card-table">
            <thead>
              <tr>
                {
                  MARKET_TABLE_HEADER.map((text, i) =>
                    <th key={i} className={`${text === 'Due Date' ? 'underline' : ''}`}>
                      {
                        text === 'Due Date' ?
                          <Tooltip placement="topLeft" title={`loan must be repaid before expiry or you will default and lose your collateral.`}>
                            {text}
                          </Tooltip>
                          :
                          text
                      }
                    </th>
                  )
                }
              </tr>
            </thead>
            {
              list.map((item, i) =>
                <Row
                  key={i}
                  item={item}
                  theme={theme}
                  colAmt={assetsMap[item.col]}
                  bcAssetsMap={assetsMap[item.colE]}
                  pairedAmt={pairedAmt}
                  colPrice={priceMap[item.col]}
                  bcPrice={priceMap[item.colE]}
                  lendApy={lendApyMap[item.colE]}
                  borrowApy={borrowApyMap[item.colE]}
                  supply={supplyMap[item.colE]}
                  changeVisible={changeVisible}
                  setIndex={setIndex}
                  updateOpNum={updateOpNum}
                  handleOp={handleOp}
                  goSwap={goSwap}
                  onDepositChange={onDepositChange}
                />
              )
            }
            {
              list.length ? null :
                <tbody>
                  <tr>
                    <td colSpan="4" className="empty">No pool in Market!</td>
                  </tr>
                </tbody>
            }
          </table>
        </div>
      </div>
    </div>
  )
};

export default PageView;
