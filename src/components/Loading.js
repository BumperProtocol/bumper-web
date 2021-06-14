/**
 * Loading
 */

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import ctx, { mapData, unmapActions } from '../events';

import './Loading.scss';

const ComponentView = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const lifetimeObj = {};
    mapData({
      showLoading(value) {
        setShow(value);
      },
      loadingMessage(value) {
        setMessage(value);
      }
    }, ctx, lifetimeObj);
    return () => {
      unmapActions(lifetimeObj)
    }
  }, []);
  return ReactDOM.createPortal(
    (<>
      { show ? (
        <div className="layer">
          <div className="loading">
            <div className="loading-fill"></div>
            <LoadingOutlined className="loading-icon" />
            <div className="loading-message">{message}</div>
          </div>
        </div>
      ) : null}
    </>),
    document.getElementById('modal')
  );
};

export default ComponentView;
