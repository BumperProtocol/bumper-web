/**
 * Header
 */

import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import { showInfo } from './Modal';
import Config from '../config';
import './Header.scss';
import LIGHT_LOGO from '../resources/logo-light.png'
import DARK_LOGO from '../resources/logo-dark.png'
import LIGHT_ICON from '../resources/dark.png'
import DARK_ICON from '../resources/light.png'
import ctx, { mapData, unmapActions } from '../events';

const localStyle = {
  iconStyle: {
    fontSize: '15px',
    verticalAlign: 'middle'
  },
  iconBigStyle: {
    fontSize: '32px',
    verticalAlign: 'middle',
    color: '#fff'
  }
}

const connectWallet = () => {
  const { chainAccount } = ctx.data;
  if (chainAccount) {
    showInfo({
      content: `Your wallet address is already connected:\n${chainAccount}`
    });
    return;
  }
  ctx.event.emit('connectWallet');
}

const changeTheme = (theme) => {
  const newTheme = theme === 'dark' ? 'light' : 'dark'
  ctx.event.emit('changeTheme', newTheme);
}

const menu = () => {
  return (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noreferrer" href={Config.whitepaperLink}>
          whitepaper
        </a>
      </Menu.Item>
      <Menu.Item onClick={connectWallet}>
        <span>
          wallet
        </span>
      </Menu.Item>
    </Menu>
  );
};

const ComponentView = () => {
  const history = useHistory();
  // const location = useLocation();
  const [account, setAccount] = useState('');
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const lifetimeObj = {};
    mapData({
      chainAccount(chainAccount) {
        console.log('chainAccount:', chainAccount)
        if (chainAccount) {
          setAccount(chainAccount);
          history.replace('/markets');
        } else {
          history.replace('/');
        }
      },
      theme(value) {
        setTheme(value)
      }
    }, ctx, lifetimeObj);
    return () => {
      unmapActions(lifetimeObj);
    };
  }, [history]);

  return (
    <div className="nav-header">
      <div className="container">
        <div className="logo-wrapper">
          <div className="logo logo-pc">
            <NavLink to="/markets">
              <img src={theme === 'dark' ? DARK_LOGO : LIGHT_LOGO} alt="logo" />
            </NavLink>
          </div>
        </div>
        <div className="navigator">
          <span className="label theme pc" onClick={() => { changeTheme(theme) }}>
            {
              theme === 'dark' ?
                <>
                  <img src={DARK_ICON} className="icon" alt="DARK_ICON" />
                light&nbsp;mode
                </> : null
            }
            {
              theme === 'light' ?
                <>
                  <img src={LIGHT_ICON} className="icon" alt="LIGHT_ICON" />
              dark&nbsp;mode
              </>
                : null
            }
          </span>
          <NavLink className="navtab" to="/markets" >Markets</NavLink>
          {/* <NavLink className="navtab" to="/farms" >Farms</NavLink> */}
        </div>
        {/* <span className="label bp pc">Bumper: {bpAmt} </span> */}
        <div className="wallet-pc button" onClick={connectWallet}>
          <WalletOutlined style={localStyle.iconStyle} />
          <span className="label">
            {account ? account.slice(0, 6) + '...' + account.slice(-4, account.length) : 'Connect Wallet'}
          </span>
        </div>
        <Dropdown overlay={menu} className="wallet-mobile" overlayClassName="menu-dropdown">
          <MenuFoldOutlined style={localStyle.iconBigStyle} />
        </Dropdown>
      </div>
    </div>
  );
};

export default ComponentView;
