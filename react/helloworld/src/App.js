import React, { Component } from 'react';
import './App.css';
import ThemeSetting from './advance/context/ThemeSetting';
import FunctionLifeCycle from './advance/lifecycle/FunctionLifeCycle';
class App extends Component {
  render() {
    return (
      <div className="App">
        <h1> Hello, World! </h1>
        <ThemeSetting />
        <FunctionLifeCycle />
      </div>
    );
  }
}

export default App;
