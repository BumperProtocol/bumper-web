// bumper
import React from 'react'

import './PercentBox.scss';

const ComponentView = (props) => {
  const {
    balance=0,
    theme='dark',
    onClick = () => { },
    className = ''
  } = props;
  return (
    <div className={className}>
      <div className={`p-box p-box-${theme}`}>
        <div className={`p-cell p-cell-${theme}`} onClick={() => { onClick(0.25*balance) }}>25%</div>
        <div className={`p-cell p-cell-${theme}`} onClick={() => { onClick(0.5*balance) }}>50%</div>
        <div className={`p-cell p-cell-${theme}`} onClick={() => { onClick(0.75*balance) }}>75%</div>
        <div className={`p-cell p-cell-${theme}`} onClick={() => { onClick(balance) }}>100%</div>
      </div>
    </div>
  );
};

export default ComponentView;
