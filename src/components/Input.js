/**
 * Input
 */


import React from 'react'

import './Input.scss';

const ComponentView = (props) => {
  const {
    token='',
    placeholder='',
    value='',
    balance=0,
    onChange=() => {},
    className='',
    theme='dark'
  } = props;
  const placeholderText = placeholder ? placeholder: `Amount of ${token}`
  return (
    <div className={className}>
      <div className={`balance-input common-${theme}`}>
        <input
          type="number"
          value={value}
          placeholder={placeholderText}
          onChange={
            (event) => onChange(event.target.value)
          }
        />
        <div>
          <span className="max" onClick={() => onChange(balance)}>Max</span>
        </div>
      </div>
    </div>
  );
};

export default ComponentView;
