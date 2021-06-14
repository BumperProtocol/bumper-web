/**
 * Footer
 */

import React, { useEffect, useState } from 'react';
import './Footer.scss';
import BookOutlined from '@ant-design/icons/BookOutlined';
import GithubOutlined from '@ant-design/icons/GithubOutlined';
import TwitterOutlined from '@ant-design/icons/TwitterOutlined';
import MediumOutlined from  '@ant-design/icons/MediumOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import SendOutlined from '@ant-design/icons/SendOutlined';
import Config from '../config';
import ctx, { mapData, unmapActions } from '../events';

const ComponentView = () => {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const lifetimeObj = {};
    mapData({
      theme(value){
        setTheme(value)
      }
    }, ctx, lifetimeObj);
    return () => {
      unmapActions(lifetimeObj);
    };
  }, []);

  return (
    <div className={`footer text-${theme}`}>
      <div className="foot-tips">This product is experimental. Use at your own risk.</div>
      <div className="foot-container">
        <a target="_blank" rel="noreferrer" href={Config.whitepaperLink}>
          <BookOutlined className={`icon icon-${theme}`} />
        </a>
        <a target="_blank" rel="noreferrer" href={Config.githubLink}>
          <GithubOutlined className={`icon icon-${theme}`} />
        </a>
        <a target="_blank" rel="noreferrer" href={Config.twitterLink}>
          <TwitterOutlined className={`icon icon-${theme}`} />
        </a>
        <a target="_blank" rel="noreferrer" href={Config.mediumLink}>
          <MediumOutlined className={`icon icon-${theme}`} />
        </a>
        <a target="_blank" rel="noreferrer" href={Config.telegramLink}>
          <SendOutlined className={`icon icon-${theme}`} />
        </a>
        <a target="_blank" rel="noreferrer" href={Config.docLink}>
          <FileTextOutlined className={`icon icon-${theme}`} />
        </a>
        <a target="_blank" rel="noreferrer" href={Config.coinLink}>
          <span className="text">BUMPER</span>
        </a>
      </div>
    </div>
  );
};

export default ComponentView;
