/**
 * Box
 */

import React from 'react'

import './Box.scss';

const ComponentView = (props) => {
  const {
    children = '',
    className = ''
  } = props;
  return (
    <div className={`outlined-box ${className}`}>
      <div className="box">
        { children }
      </div>
    </div>
  );
};

export default ComponentView;
