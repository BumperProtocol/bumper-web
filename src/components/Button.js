/**
 * Button
 */

import React from 'react'

import './Button.scss';

const ComponentView = (props) => {
  const { children = '', theme='',  className = '', onClick = () => {} } = props;
  return (
    <div className={`outlined-button ${className} border-${theme}`} onClick={onClick}>
      <div className={`button border-${theme} text-${theme}`}>
        { children }
      </div>
    </div>
  );
};

export default ComponentView;
