import React from 'react';
import Setting from './Setting';
import { ThemeContext } from './index';

const ThemeSetting = function ThemeSetting() {
  return (
    <ThemeContext.Provider value="light">
      <Setting />
    </ThemeContext.Provider>
  );
};

export default ThemeSetting;
