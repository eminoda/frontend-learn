import React from 'react';
import { ThemeContext } from './index';

const Setting = () => {
  return (
    <ThemeContext.Consumer>
      {(value) => {
        return <div>{value}</div>;
      }}
    </ThemeContext.Consumer>
  );
};

export default Setting;
